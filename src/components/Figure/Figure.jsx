import styles from "./Figure.module.scss";
import { picesValues } from "../../utils/constants";

export const Figure = ({value, pices, prevMove}) => {
    return (
        <div className={styles.figure} draggable>
            <img
                src={`/pices/${pices}/${value.color[0]}${value.sym}.png`}
            />
        </div>
    );
};
