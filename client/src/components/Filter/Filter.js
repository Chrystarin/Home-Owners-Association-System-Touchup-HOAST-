import React,{useEffect,useState} from 'react'
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function Filter(props) {

    
    useEffect(() => {
        setDefaultValue(props.value);
    }, [])
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const openFilter = Boolean(anchorElFilter);
    
    const [defaultValue,setDefaultValue] = useState();

    const [value,setValue]= useState({
        sortBy:""
    })



    return <>
        
        <Button 
            variant="" 
            startIcon={<FilterAltIcon/>} 
            onClick={(event) => setAnchorElFilter(event.currentTarget)}>
                Filter
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorElFilter}
            open={openFilter}
            onClose={() => {
                setAnchorElFilter(null);
            }}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <div className='Filter'>
                <h6 className='Filter__Title'>Filter</h6>
                <ul>
                    <li>
                        <p className="BodyText3 Filter__Titles">Sort by</p>
                        <div>
                            <NativeSelect

                                defaultValue={null}
                                onChange={(e)=> {
                                    setValue(value=>({...value,sortBy:e.target.value}))
                                }}
                                inputProps={{
                                name: 'age',
                                id: ' SortBy uncontrolled-native',
                                }}
                            >
                                <option value={""}></option>
                                <option value={"A_Z"}>A to Z</option>
                                <option value={"Z_A"}>Z to A</option>
                                <option value={"Recent"}>Recent</option>
                                
                            </NativeSelect>
                        </div>
                    </li>
                </ul>
                <div className='Filter__Buttons'>
                    <div>
                        <Button variant=''
                            onClick={()=>{
                                props.setValue(defaultValue);
                                setAnchorElFilter(null);
                            }}
                        >Reset All</Button>
                    </div>
                    <Button variant='' onClick={()=>setAnchorElFilter(null)}>Cancel</Button>
                    <Button variant='contained' onClick={()=>{
                        props.setValue(value);
                        setAnchorElFilter(null);
                    }}>Apply</Button>
                </div>
            </div>
        </Menu>
        
    
    </>
}

export default Filter