import React from 'react';
import Select from 'react-select';
import { imgSrcsDay, imgSrcsNight } from './consts';
import { DayOrNight } from './Generator';
import { IconSelectLabel } from './IconSelectLabel';

const customStyles = {
    input: () => ({
        height: 55,
        width: 0
    }),
    singleValue: () => ({
        width: '100%',
        backgroundColor: '#23425f'
    })
};

interface IconSelectProps {
    onIconSelected: (iconSrc: string) => void;
    dayOrNight: DayOrNight;
    defaultIconCode: string | null;
}

export class IconSelect extends React.Component<IconSelectProps> {
    constructor(props: IconSelectProps) {
        super(props);
    }

    private getOptions() {
        const iconCodesJson = this.props.dayOrNight === 'day' ? imgSrcsDay : imgSrcsNight;
        return Object.keys(iconCodesJson).map(obj => {
            return {
                value: obj,
                label: <IconSelectLabel iconCodesJson={iconCodesJson} iconCode={obj} />
            };
        });
    }

    render() {
        // @ts-ignore
        const iconsCollection = this.props.dayOrNight === 'day' ? imgSrcsDay : imgSrcsNight;
        return (
            <>
                <Select
                    options={this.getOptions()}
                    value={{
                        label:
                            this.props.defaultIconCode !== null && iconsCollection[this.props.defaultIconCode] ? (
                                <IconSelectLabel
                                    iconCodesJson={iconsCollection}
                                    iconCode={this.props.defaultIconCode}
                                />
                            ) : null,
                        value: this.props.defaultIconCode
                    }}
                    menuPlacement="top"
                    placeholder={''}
                    styles={customStyles}
                    onChange={value => {
                        value && this.props.onIconSelected(value['value']);
                    }}
                />
            </>
        );
    }
}
