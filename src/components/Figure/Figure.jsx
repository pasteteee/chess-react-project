import styles from "./Figure.module.scss";
import { picesValues } from "../../utils/constants";

export const Figure = (props) => {
    return (
        <div className={styles.figure} draggable>
            <img
                src={`/pices/${props.pices}/${props.value.color[0]}${props.value.sym}.png`}
            />
        </div>
    );
};
