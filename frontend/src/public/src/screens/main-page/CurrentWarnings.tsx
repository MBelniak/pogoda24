import React from 'react';
import './CurrentWarnings.scss';
import { WarningInfo } from './MainPage';

interface CurrentWarningsProps {
    warningInfo: WarningInfo[];
}

export const CurrentWarnings = (props: CurrentWarningsProps) => {
    return (
        <div className="currentWarnings">
            {props.warningInfo.length > 0 ? (
                <>
                    <p
                        className="postTitle fontSizeLarge"
                        style={{
                            wordWrap: 'break-word'
                        }}>
                        Aktualne ostrzeżenia
                    </p>
                    {props.warningInfo.map((info, key, list) => {
                        const href = 'posts/' + info.postId;
                        return (
                            <div key={key} className="currentWarning fontSizeSmall">
                                <a className="postLink" href={href}>
                                    {info.title}
                                </a>
                                {list.length - 1 === key ? null : <div className="is-divider" />}
                            </div>
                        );
                    })}
                </>
            ) : (
                <p className="currentWarningsNone fontSizeLarge">Brak ostrzeżeń</p>
            )}
        </div>
    );
};
