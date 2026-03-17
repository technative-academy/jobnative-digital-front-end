import { getBadgeTone } from "../../utils/colorSystem";
import "./Badge.css";

function Badge({
  text,
  category = "generic",
  className = "",
  colour,
  textColour,
  tone,
}) {
  const resolvedTone = tone || getBadgeTone(text, category);
  const classes = ["badge", colour ? "" : `badge--${resolvedTone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      style={
        colour
          ? {
              backgroundColor: colour,
              color: textColour,
            }
          : undefined
      }
    >
      {text}
    </span>
  );
}

export default Badge;
