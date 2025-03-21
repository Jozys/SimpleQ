import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserContentService } from '../database/user-content/user-content.service';
import { TypeOfAI, User } from '@prisma/client';
import { UserService } from '../database/user/user.service';
import { AI_LIMIT } from '../../config';
import { AIException } from './exceptions/AIException';
import * as process from 'node:process';
import OpenAI from 'openai';

@Injectable()
export class ExternalAPIService {
  constructor(
    private readonly httpService: HttpService,
    private readonly databaseContentService: UserContentService,
    private readonly databaseUserService: UserService,
  ) {}

  showdown = require('showdown');
  openAI = new OpenAI({ apiKey: process.env.GPT_APP_TOKEN });
  /**
   * This function should check if a user is allowed to use the AI answer generation.
   * @param userID
   * @throws user ID not found | You have reached the limit for free AI responses
   */
  private async checkAllowed(userID: string) {
    const user: User | null = await this.databaseUserService.getUser(userID);
    if (user == null) {
      throw new AIException('GENERAL', `User ID >${userID}< not found`);
    } else if (
      user.isPro == false ||
      (await this.databaseContentService.countAIAnswersForUser(userID)) >=
        AI_LIMIT
    ) {
      throw new AIException(
        'GENERAL',
        `User >${user.username}< has reached the limit for free AI responses`,
      );
    }
  }

  /**
   * This function should check the params for the AI functions.
   * @param prompt
   * @param groupID
   * @throws The prompt cannot be empty | Group ID not found | The environment variable for AI is undefined | An AI-generated answer with this groupID already exists
   */
  private async checkParams(prompt: string, groupID: string): Promise<boolean> {
    if (prompt === '') {
      throw new AIException('GENERAL', 'The prompt cannot be empty');
    } else if (
      !(await this.databaseContentService.checkGroupIDExists(groupID))
    ) {
      throw new AIException('GENERAL', `Group ID >${groupID}< not found`);
    } else if (process.env.DISABLE_AI === 'true') {
      return false;
    } else if (
      process.env.WOLFRAM_URL == undefined ||
      process.env.GPT_APP_URL == undefined ||
      process.env.GPT_APP_TOKEN == undefined ||
      process.env.WOLFRAM_APP_ID == undefined
    ) {
      throw new AIException(
        'GENERAL',
        `At least one environment variable for external API is missing`,
      );
    } else if (
      await this.databaseContentService.checkAIAnswerExists(groupID, [
        TypeOfAI.GPT,
        TypeOfAI.WolframAlpha,
      ])
    ) {
      throw new AIException(
        'GENERAL',
        `An AI-generated answer with the groupID >${groupID}< already exists`,
      );
    } else {
      return true;
    }
  }

  /**
   * This function should generates an AI answer with the Wolfram Alpha API.
   * @param prompt
   * @param groupID
   * @param userID
   * @returns Promise<string>
   * @throws AIException
   * @throws Error
   */
  async requestWolfram(
    prompt: string,
    groupID: string,
    userID: string,
  ): Promise<void> {
    await this.checkAllowed(userID);
    const paramsCheck = await this.checkParams(prompt, groupID);
    if (paramsCheck) {
      Logger.log(`REQUEST WOLFRAM >${prompt}<`, 'EXTERNAL API');
      let data: any;
      try {
        data = (
          await firstValueFrom(
            this.httpService
              .get(
                `${process.env.WOLFRAM_URL}?appid=${process.env.WOLFRAM_APP_ID}&i=${encodeURIComponent(prompt)}`,
              )
              .pipe(),
          )
        ).data;
      } catch (error) {
        Logger.warn(
          `WOLFRAM, Cannot reach server at >${process.env.WOLFRAM_URL}< or input cannot be understood`,
          `EXTERNAL_API`,
        );
        return;
      }
      const imageBase64 = Buffer.from(data, 'binary').toString('base64');
      await this.databaseContentService.createAnswer(
        null,
        groupID,
        imageBase64,
        TypeOfAI.WolframAlpha,
      );
      Logger.log('Wolfram generation successful!', 'EXTERNAL API');
    } else {
      Logger.log(
        'AI generation skipped; DISABLE_AI is true in config.ts',
        'EXTERNAL API',
      );
    }
  }

  /**
   * This function should generates an AI answer with the LLM API.
   * @param prompt
   * @param groupID
   * @param userID
   * @returns Promise<string>
   */
  async requestGPT(
    prompt: string,
    groupID: string,
    userID: string,
  ): Promise<void> {
    await this.checkAllowed(userID);
    const paramsCheck = await this.checkParams(prompt, groupID);

    if (paramsCheck) {
      Logger.log(`REQUEST GPT, >${prompt}<`, 'EXTERNAL API');
      let data: any;
      try {
        const response = await this.openAI.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
          ],
        });
        data = response.choices[0].message.content;
      } catch (error) {
        throw new AIException('GPT', `Cannot reach OpenAI server`);
      }
      if (data != null) {
        const converter = new this.showdown.Converter();
        await this.databaseContentService.createAnswer(
          null,
          groupID,
          converter.makeHtml(data),
          TypeOfAI.GPT,
        );
        Logger.log('GPT successful', 'EXTERNAL API');
        return data.output;
      } else {
        throw new AIException('GPT', 'No output created!');
      }
    } else {
      Logger.log(
        'AI generation skipped; DISABLE_AI is true in config.ts',
        'EXTERNAL API',
      );
    }
  }
}
