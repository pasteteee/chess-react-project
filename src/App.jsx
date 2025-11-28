import styles from "./App.module.scss";
import { Board } from "./components/Board/Board";
import { defaultBoard } from "./utils/constants";
import { themeSwitch } from "./utils/theme";
import { useState } from "react";

export const App = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlipBoard = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.controls}>
                <button 
                    className={styles.button}
                    onClick={() => themeSwitch()}
                    title="Переключить тему"
                >
                    Тема
                </button>
                <button 
                    className={styles.button}
                    onClick={handleFlipBoard}
                    title="Перевернуть доску"
                >
                    Перевернуть
                </button>
            </div>
            <div className={styles.board__wrapper}>
                <Board
                    startBoard={defaultBoard}
                    pices={"california"}
                    currentPlayerColor={"white"}
                    isFlipped={isFlipped}
                />
            </div>
        </div>
    );
};
