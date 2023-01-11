import { Filter, Category } from "../functions/filter";

type Props = {
    setFilter: (state: Filter) => void;
    filter: Filter;
    category: Category;
};

export default function Checkbox({ setFilter, filter, category }: Props) {
    return (
        <div>
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
