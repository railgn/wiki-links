import type { Filter, Category } from "@lib/filter";
import styles from "../styles/checkbox.module.css";

interface Props {
    setFilter: (state: Filter) => void;
    filter: Filter;
    category: Category;
    mykey: number;
    isLeader: boolean;
}

export default function Checkbox({
    setFilter,
    filter,
    category,
    mykey,
    isLeader,
}: Props) {
    return (
        <div key={mykey} className={styles.checkbox}>
            <label htmlFor={category}>
                <input
                    type="checkbox"
                    name={category}
                    defaultChecked={filter[category]}
                    checked={filter[category]}
                    disabled={!isLeader}
                    onClick={() => {
                        setFilter({
                            ...filter,
                            [category]: !filter[category],
                        });
                    }}
                ></input>
                {category}
            </label>
        </div>
    );
}
