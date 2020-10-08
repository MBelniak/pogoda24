import React from 'react';
import Select from 'react-select';
import { imgSrcsDay, imgSrcsNight } from './consts';
import { DayOrNight } from './Generator';

const customStyles = {
    input: () => ({
        height: 55
    })
};

interface IconSelectProps {
    onIconSelected: (iconSrc: string) => void;
    dayOrNight: DayOrNight;
    defaultIconSrc: string | null;
}

export class IconSelect extends React.Component<IconSelectProps> {
    constructor(props: IconSelectProps) {
        super(props);
    }

    private getOptions() {
        const imgSrcs = this.props.dayOrNight === 'day' ? imgSrcsDay : imgSrcsNight;
        return imgSrcs.map(src => {
            return {
                value: src,
                label: (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            className="selectImage"
                            src={src}
                            height="50px"
                            width="50px"
                            onClick={() => this.props.onIconSelected(src)}
                        />
                    </div>
                )
            };
        });
    }

    render() {
        return (
            <div>
                <Select
                    options={this.getOptions()}
                    defaultValue={{
                        label: (
                            <div style={{ textAlign: 'center' }}>
                                {this.props.defaultIconSrc !== null ? (
                                    <img
                                        className="selectImage"
                                        src={this.props.defaultIconSrc}
                                        height="50px"
                                        width="50px"
                                    />
                                ) : null}
                            </div>
                        ),
                        value: this.props.defaultIconSrc
                    }}
                    menuPlacement="top"
                    placeholder={''}
                    styles={customStyles}
                />
            </div>
        );
    }
}
