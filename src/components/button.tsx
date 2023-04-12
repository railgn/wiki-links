import encodeURL from "@lib/encode_url";

import styles from "../styles/button.module.css";

export type ButtonReturn = "correct" | "incorrect" | "waiting";

interface Props {
    setButtonReturn: (state: ButtonReturn) => void;
    buttonReturn: ButtonReturn;
    display: string;
    article: string;
    color: string;
    roundOver: boolean;
    mykey: number;
    isSpectator: boolean;
}

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
    } else {
        switch (mykey) {
            case 1:
                buttonStyle = styles.blue;
                break;
            case 2:
                buttonStyle = styles.yellow;
                break;
            case 3:
                buttonStyle = styles.purple;
                break;
            case 4:
                buttonStyle = styles.orange;
                break;
        }
    }

    const articleURL = encodeURL(article);

    return (
        <span className={styles.button}>
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

                    {/* {roundOver && (
                        <a href={articleURL} target="_blank" rel="noreferrer">
                            {article}
                        </a>
                    )} */}
                </>
            )}
        </span>
    );
}
