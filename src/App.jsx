import styles from "./App.module.scss";
import { Board } from "./components/Board/Board";
import { defaultBoard } from "./utils/constants";
import { themeSwitch } from "./utils/theme";

export const App = () => {
    return (
        <div className={styles.wrapper}>
            <button onClick={() => themeSwitch()}>Click</button>
            <div className={styles.board__wrapper}>
                <Board
                    startBoard={defaultBoard}
                    pices={"california"}
                    currentPlayerColor={"white"}
                />
            </div>
        </div>
    );
};
