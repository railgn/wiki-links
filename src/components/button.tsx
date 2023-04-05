import { ButtonReturn } from "./form-mc";
import encodeURL from "../functions/encode_url";
import styles from "../styles/button.module.css";

type Props = {
    setButtonReturn: (state: ButtonReturn) => void;
    buttonReturn: ButtonReturn;
    display: string;
    article: string;
    color: string;
    roundOver: boolean;
    mykey: number;
    isSpectator: boolean;
};

export default function Button({
    setButtonReturn,
    buttonReturn,
    display,
    article,
    color,
    roundOver,
    mykey,
    isSpectator,
}: Props) {
    const onClick = (event: any) => {
        event.preventDefault();

        setButtonReturn(event.target.name as ButtonReturn);
    };

    let buttonStyle = styles.normal;

    if (roundOver) {
        buttonStyle =
            buttonReturn === "correct" ? styles.correct : styles.incorrect;
    }

    const articleURL = encodeURL(article);

    return (
        <div>
            {display !== "" && (
                <>
                    <button
                        disabled={isSpectator}
                        type="button"
                        onClick={onClick}
                        name={buttonReturn}
                        className={buttonStyle}
                        key={mykey}
                    >
                        {display}
                    </button>
                    &nbsp; &nbsp;
                    {roundOver && (
                        <a href={articleURL} target="_blank">
                            {article}
                        </a>
                    )}
                </>
            )}
        </div>
    );
}
