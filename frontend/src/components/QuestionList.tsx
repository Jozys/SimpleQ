import { useAlert } from "react-alert";
import React, { useEffect } from "react";
import AdjustUserContent, {
  PreviewStyleDef,
  SortByDef,
  SortDirectionDef,
} from "./AdjustUserContent";
import { parseQuestion, QuestionDef } from "../def/QuestionDef";
import { axiosError } from "../def/axios-error";
import NoContent from "./NoContent";
import QuestionPreview from "./questionpreview/QuestionPreview";
import QuestionPreviewSkeleton from "./questionpreview/QuestionPreviewSkeleton";
import SectionGrid from "./section/SectionGrid";
import QuestionPreviewSmall from "./questionpreview/QuestionPreviewSmall";

export default function QuestionList(props: {
  url: string;
  header: (filters: any) => JSX.Element;
}) {
  const alert = useAlert();

  const [previewStyle, setPreviewStyle] = React.useState<PreviewStyleDef>(
    PreviewStyleDef.normal
  );

  const [sortBy, setSortBy] = React.useState<SortByDef>(SortByDef.ldr);
  const [sortDirection, setSortDirection] = React.useState<SortDirectionDef>(
    SortDirectionDef.desc
  );

  const [questions, setQuestions] = React.useState<QuestionDef[] | undefined>(
    undefined
  );

  useEffect(() => {
    setQuestions(undefined);

    global.axios
      .get(
        props.url + "?sortBy=" + sortBy + "&sortDirection=" + sortDirection,
        { withCredentials: true }
      )
      .then((res) => {
        let _questions: QuestionDef[] = [];
        res.data.forEach((_question: any) => {
          if (!_question.id) return null;
          _questions.push(parseQuestion(_question));
        });
        setQuestions(_questions);
      })
      .catch((err) => axiosError(err, alert));
  }, [alert, sortBy, sortDirection]);

  return (
    <>
      {props.header(
        <AdjustUserContent
          previewStyle={previewStyle}
          setPreviewStyle={setPreviewStyle}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          direction={"right"}
        />
      )}

      {questions && questions.length === 0 && <NoContent />}

      {previewStyle === "normal" &&
        (questions ? (
          questions.map((question, index) => (
            <QuestionPreview
              question={question}
              index={index}
              key={question.id}
            />
          ))
        ) : (
          <QuestionPreviewSkeleton count={3} />
        ))}

      {previewStyle === "small" && (
        <SectionGrid>
          {questions ? (
            questions.map((question) => (
              <QuestionPreviewSmall question={question} key={question.id} />
            ))
          ) : (
            <>
              <QuestionPreviewSmall />
              <QuestionPreviewSmall />
              <QuestionPreviewSmall />
              <QuestionPreviewSmall />
              <QuestionPreviewSmall />
            </>
          )}
        </SectionGrid>
      )}
    </>
  );
}
