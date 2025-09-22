import styles from "./App.module.scss";
import { Board } from "./components/Board/Board";
import { defaultBoard } from "./utils/constants";

export const App = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.board__wrapper}>
                <Board startBoard={defaultBoard} pices={"alpha"} />
            </div>
        </div>
    );
};
