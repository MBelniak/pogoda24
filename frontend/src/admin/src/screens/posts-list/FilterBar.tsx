import React, {ChangeEvent} from 'react';

export interface FilterBarProps {
    onFilter: (filterValue: string) => void;
}

const filterTimeout = 1100;

export const FilterBar = (props: FilterBarProps) => {

    const placeholder = React.useRef<string>("");
    const filterTimeoutRef = React.useRef<number | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFocus = React.useCallback((e) => {
        if (inputRef.current) {
            inputRef.current.classList.remove('filterBar__font-awesome');
            if (inputRef.current.value === '') {
                placeholder.current = inputRef.current.placeholder;
                inputRef.current.placeholder = "";
            }
        }
    }, []);

    const handleBlur = React.useCallback((e) => {
        if (inputRef.current && (!inputRef.current.value || inputRef.current.value === '')) {
            if (!inputRef.current.classList.contains('filterBar__font-awesome')) {
                inputRef.current.classList.add('filterBar__font-awesome');
                inputRef.current.placeholder = placeholder.current;
            }
        }
    }, [])

    const handleSimpleChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.value = e.target.value
            if (filterTimeoutRef.current !== null) {
                clearTimeout(filterTimeoutRef.current);
            }
            filterTimeoutRef.current = setTimeout(props.onFilter, filterTimeout, inputRef.current.value);
        }
    }, []);

    return <div className={"filterBarContainer"}>
        <input className="input filterBar__font-awesome" type="text" maxLength={100}
               placeholder='&#xf002;'
               onFocus={handleFocus}
               onBlur={handleBlur}
               onChange={handleSimpleChange}
               ref={inputRef}
        />
    </div>
}
