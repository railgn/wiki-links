import { boolean } from "zod";
import { ButtonReturn } from "./form-mc";

type Props = {
    setButtonReturn: (state: ButtonReturn) => void;
    buttonReturn: ButtonReturn;
    display: string;
    article: string;
    color: string;
    roundOver: boolean;
};

export default function Button({
    setButtonReturn,
    buttonReturn,
    display,
    article,
    color,
    roundOver,
}: Props) {
    const onClick = (event: any) => {
        event.preventDefault();

        setButtonReturn(event.target.name as ButtonReturn);
    };

    //change color on roundover -> color
    //color is based on "button Return" being Correct or incorrect

    //color property in HTML = a function that acts like a switch statement for style

    //make this the condintional thing {roundover && (<>article here</>)}
    //add text for "Source article: " on roundover
    //display text has the same sort of switch functionality

    return (
        <div>
            {/* @ts-ignore */}
            {display !== "" && (
                <button type="button" onClick={onClick} name={buttonReturn}>
                    {display}
                </button>
            )}
        </div>
    );
}
