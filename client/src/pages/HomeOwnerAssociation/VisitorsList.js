import React,{useState, useEffect} from 'react'
import './Dashboard.scss';

import NavBar from '../../layouts/NavBar';
import Card from '../../components/Card/Card';
import SideBar from './SideBar';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInput from '../../components/SearchInput/SearchInput';
import Menu from '@mui/material/Menu';
import NativeSelect from '@mui/material/NativeSelect';

import axios from '../../utils/axios';
import loading from '../../images/loading.gif';
function VisitorsList() {

    const [visitors, setVisitors] = useState();
    
    // States for Tabs
    const [stepper, setStepper] = useState(1);
    // States for popup filter
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const openFilter = Boolean(anchorElFilter);

    useEffect(() => {
		const fetchVisitors = async () => {
			await axios
				.get(`visitors`, {
					params: {
						hoaId: localStorage.getItem('hoaId')
					}
				})
				.then((response) => {
					setVisitors(response.data);
				});
		};
        fetchVisitors();
	}, []);

    function crawler(data, parent = '') {
        return Object.entries(data).reduce((result, [key, value]) => {
            const updatedKey = parent ? `${parent}.${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return {
                    ...result,
                    ...crawler(value, updatedKey)
                };
            }

            return {
                ...result,
                [updatedKey]: value
            };
        }, {});
    }

	function exportVisitorsList(data) {
        // console.log(data)
        // Create the CSV content
        let csvContent = data
            .map((d) => {
                const crawled = crawler(d);

				const arrival = crawled['arrival'];
                const departure = crawled['departure'];

                return [
                    crawled['name'],
                    crawled['home'],
                    `${arrival.getMonth() + 1}/${arrival.getDate()}/${arrival.getFullYear()}`,
                    `${departure.getMonth() + 1}/${departure.getDate()}/${departure.getFullYear()}`,
                ].join(',');
            })
            .join('\n');
        
        const date = new Date();
        csvContent = `Date,${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}\n` +
                     `Header,Visitors List\n` +
                     '\n' +
                     'Visitor Name,Home ID,Arrival Date,Departure Date\n' +
                     csvContent;

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        downloadLink.download = 'visitor_list.csv';

        // Trigger the download
        downloadLink.click();
    }
  
    if(!visitors) return <>
    <div className='Loading'>
      <img src={loading} alt="" />
      <h3>Loading...</h3>
    </div>
  </>

    return <>
        <NavBar/>
        <div className='SectionHolder'>
            <section className='Section SectionManage'>
                <SideBar active="VisitorsList"/>
                <div id='HOA__Content'>
                    <h3 className='SectionTitleDashboard'><span><a href="">Visitors List</a></span></h3>
                    
                    <div >
                        {/* <div className='SectionStepper'> 
                            <Button variant='text' className={(stepper === 1)?"active":""} onClick={()=> setStepper(1)}>Incoming</Button>
                            <Button variant='text' className={(stepper === 2)?"active":""} onClick={()=> setStepper(2)}>History</Button>
                        </div> */}
                        <div>
                            {stepper===1?<>
                                <div className='SectionController'>
                                    <div id='SearchInput__Container'>
                                        {/* <SearchInput/> */}
                                        <Button
                                            variant="contained"
                                            href="/quickpass"
                                        >
                                            Add Quick Pass
                                        </Button>
                                    </div>
                                    <Button variant="" startIcon={<FilterAltIcon/>} onClick={(event) => setAnchorElFilter(event.currentTarget)}>Filter</Button>
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
                                                    inputProps={{
                                                    name: 'age',
                                                    id: 'uncontrolled-native',
                                                    }}
                                                >
                                                    <option value={10}>A to Z</option>
                                                    <option value={20}>Recent Register</option>
                                                    <option value={30}>More Residents</option>
                                                </NativeSelect>
                                                </div>
                                                </li>
                                            </ul>
                                            <div className='Filter__Buttons'>
                                                <div>
                                                <Button variant=''>Reset All</Button>
                                                </div>
                                                <Button variant=''>Cancel</Button>
                                                <Button variant='contained' onClick={() => {setAnchorElFilter(null)}}>Apply</Button>
                                            </div>
                                        </div>
                                    </Menu>
                                    <Button variant="contained" onClick={() => exportVisitorsList(visitors)}>
                                        Export Visitors List to Excel
                                    </Button>
                                </div>
                                <div className='SectionList'>
                                {(visitors.length === 0 )?
                                    <p>No Visitors Available!</p>
                                    :
                                    <>{visitors.length > 0 && visitors.map((visitor) => {
                                        if(new Date(visitor.departure).getTime() >= new Date().getTime()){
                                            return (
                                                <Card 
                                                type="Visitor"
                                                key={visitor.visitorId}
                                                title={visitor.name}
                                                subTitle1={ new Date(visitor.arrival).toLocaleString('default', {month: 'long' }) + " " + new Date(visitor.arrival).getDate() + ", " + new Date(visitor.arrival).getFullYear()  + ' | ' + new Date(visitor.arrival).getHours() + ':' + new Date(visitor.arrival).getMinutes()}
                                                subTitle2={ new Date(visitor.departure).toLocaleString('default', {month: 'long' }) + " " + new Date(visitor.departure).getDate() + ", " + new Date(visitor.departure).getFullYear()  + ' | ' + new Date(visitor.departure).getHours() + ':' + new Date(visitor.departure).getMinutes()}
                                                url={`/visitors/${visitor.visitorId}`}
                                                />
                                            );
                                        }
                                        
                                    })}</>
                                }
                                </div>
                            </>:<></>}
                            {stepper===2?<>
                                <div className='SectionController'>
                                    <div id='SearchInput__Container'>
                                        <SearchInput/>
                                    </div>
                                    <Button variant="" startIcon={<FilterAltIcon/>} onClick={(event) => setAnchorElFilter(event.currentTarget)}>Filter</Button>
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
                                                    inputProps={{
                                                    name: 'age',
                                                    id: 'uncontrolled-native',
                                                    }}
                                                >
                                                    <option value={10}>A to Z</option>
                                                    <option value={20}>Recent Register</option>
                                                    <option value={30}>More Residents</option>
                                                </NativeSelect>
                                                </div>
                                                </li>
                                            </ul>
                                            <div className='Filter__Buttons'>
                                                <div>
                                                <Button variant=''>Reset All</Button>
                                                </div>
                                                <Button variant=''>Cancel</Button>
                                                <Button variant='contained' onClick={() => {setAnchorElFilter(null)}}>Apply</Button>
                                            </div>
                                        </div>
                                    </Menu>
                                    
                                </div>
                                <div className='SectionList'>
                                    {(visitors.length === 0 )?
                                        <p>No Visitors Available!</p>
                                        :
                                        <>{visitors.length > 0 && visitors.map((visitor) => {
                                            if(new Date(visitor.departure).getTime() <= new Date().getTime()){
                                                return (
                                                    <Card 
                                                    type="Visitor"
                                                    key={visitor.visitorId}
                                                    title={visitor.name}
                                                    subTitle1={visitor.arrival}
                                                    subTitle2={visitor.departure}
                                                    url={`/visitors/${visitor.visitorId}`}
                                                    />
                                                );
                                            }
                                        })}</>
                                    }
                                </div>
                            </>:<></>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>
}

export default VisitorsList