
import "./Tag.css"
export default function Tag( {text, colour, textColour="black"} ) {

    return(
        <span className="tag" style={{backgroundColor: colour, textColor: textColour}}>
            {text}
        </span>
    );
}