import React from 'react';
import './SearchInput.scss';
import { Avatar } from '@mui/material';
import lens from '../../images/search.png'

function SearchSuggested({data}) {
    return <>
        <div className='SearchSuggested'>
            <p className="BodyText3 SearchSuggested__Title">Search result: "{data.length}"</p>
            <ul >
                {data.length<1?<>
                        <div id='NoResult'>
                            <img src={lens} alt="" />
                            <p>No results</p>
                        </div>
                    </>
                    :<>
                        {data.map(item=>{
                            return <>
                                <li key={item.id}>
                                    <a href="">
                                        <Avatar className='SearchSuggested__Avatar'/>
                                        <p className="BodyText3">{item.name + " " + item.middlename + " " + item.lastname}</p>
                                    </a>
                                </li>
                            </>
                        })}
                    </>
                }
            </ul>
        </div>
    </>
}

export default SearchSuggested