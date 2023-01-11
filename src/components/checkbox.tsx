import { Filter, Category } from "../functions/filter";

type Props = {
    setFilter: (state: Filter) => void;
    filter: Filter;
    category: Category;
    mykey: number;
};

export default function Checkbox({
    setFilter,
    filter,
    category,
    mykey,
}: Props) {
    return (
        <div key={mykey}>
            <label htmlFor={category}>
                <input
                    type="checkbox"
                    name={category}
                    defaultChecked={filter[category]}
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
