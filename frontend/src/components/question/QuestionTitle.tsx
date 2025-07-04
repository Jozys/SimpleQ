import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { QuestionDef } from "../../def/QuestionDef";
import Button from "../button/Button";
import ButtonGroup from "../buttongroup/ButtonGroup";

/**
 * The props of the question title
 * @param session the session to determine whether to display buttons such as like, dislike, etc.
 * @param question the question
 * @param toggleFavorite the function to toggle the favorite label of the question
 * @param postVote the function to up- or downvote the question
 */
interface Props {
  authenticated?: boolean;
  question?: QuestionDef;
  toggleFavorite: () => Promise<void>;
  postVote: (vote: "like" | "dislike" | "none") => Promise<void>;
}

/**
 * Renders the title section of the question view
 * @param props the props of the question title
 */
export default function QuestionTitle(props: Props) {
  const { t } = useTranslation();

  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "calc(var(--spacing) / 2)",
          gap: "var(--spacing)",
        }}
      >
        <h1 style={{ flex: 1 }}>
          {props.question?.title ?? <Skeleton width={300} />}
        </h1>

        {props.question && (
          <>
            <Button
              iconLeft={
                props.question?.isFavorite ? "fi fi-sr-star" : "fi fi-rr-star"
              }
              iconLeftStyle={
                props.question?.isFavorite
                  ? { color: "var(--primary-color)" }
                  : {}
              }
              onClick={async () => await props.toggleFavorite()}
              disabled={!props.authenticated}
            >
              Favorite
            </Button>

            <ButtonGroup>
              <Button
                iconLeft={"fi fi-rr-social-network"}
                buttonStyle={
                  props.question?.opinion === "like" ? "primary" : "glass"
                }
                onClick={async () =>
                  await props.postVote(
                    props.question?.opinion === "like" ? "none" : "like"
                  )
                }
                disabled={!props.authenticated}
              >
                {props.question.likes}
              </Button>
              <Button
                iconLeft={"fi fi-rr-social-network flipY"}
                buttonStyle={
                  props.question?.opinion === "dislike" ? "primary" : "glass"
                }
                onClick={async () =>
                  await props.postVote(
                    props.question?.opinion === "dislike" ? "none" : "dislike"
                  )
                }
                disabled={!props.authenticated}
              >
                {props.question.dislikes}
              </Button>
            </ButtonGroup>
          </>
        )}
      </div>

      <p className={"tags"}>
        {props.question ? (
          <>
            {props.question.isDiscussion ? (
              <span className={"badge badge-outline"}>
                <i
                  className={"fi fi-rr-comments-question"}
                  style={{ marginRight: "calc(var(--spacing) / 2)" }}
                />
                {t("components.question.type.discussion")}
              </span>
            ) : (
              <span className={"badge badge-outline"}>
                <i
                  className={"fi fi-rr-interrogation"}
                  style={{ marginRight: "calc(var(--spacing) / 2)" }}
                />
                {t("components.question.type.question")}
              </span>
            )}

            <span className={"tags-divider"} />

            {props.question.tags.map((tag, index) => (
              <span key={index} className={"badge"}>
                {tag}
              </span>
            ))}
          </>
        ) : (
          <Skeleton width={200} />
        )}
      </p>
    </section>
  );
}
