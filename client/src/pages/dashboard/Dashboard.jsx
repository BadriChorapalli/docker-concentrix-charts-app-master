import './Dashboard.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Form,
    Button,
    FormGroup,
    FormControl,
    ControlLabel,
    Col,
    Card,
    ListGroup,
    ListGroupItem,
    Row,
    Container,
  } from "react-bootstrap";
  import {
    LineChart,
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
  } from "recharts";
  import api from '../../api'
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 10;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightblue' : '#ECECF8',

    // styles we need to apply on draggables
    ...draggableStyle
});
const getChartDashboardStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid,
    margin: `${grid}px`,
    float:'left',
    height:'auto',

    // change background colour if dragging
    background: isDragging ? 'lightblue' : '#ECECF8',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#C7C9CB' : '#ECECF8',
    padding: grid,
    width: '90%'
});
const getDashboardChartListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#C7C9CB' : '#ECECF8',
    padding: grid,
    width: '100%',
    float:'left',
    height:900
});
const  splitData=(charts) =>{
    let dataArray=[];
    let ItemArray=[];
    let dashBoardArray=[];
    charts.forEach((chart, index) => {
    if(chart.showChart){
            dashBoardArray.push(chart);
        }else{
            ItemArray.push(chart);
        }
    });
    dataArray.push(ItemArray)
    dataArray.push(dashBoardArray)
 return dataArray;   
}
class CloseCard extends Component {
    render() {
        return <Button variant="secondary" className="closeCard"  onClick={() => this.props.onDelete(this.props.id)} >X</Button> 
    }
}
class Dashboard extends React.Component {
    state = {
        items: [],
        selected:[],
        message:''
    };
    
    
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    getList = (id) => this.state[this.id2List[id]];
   
    componentDidMount = async () => {
        await api.getAllCharts().then(charts => {
            let displayCharts=splitData(charts.data.data)
            this.setState({
                items:displayCharts[0],
                selected: displayCharts[1]
            });
            
            
        })
    }

    onCloseCard = (result,sc) => {
          let items = this.state.selected.filter(item => item._id == result);
          let closedItem=items[0] 
          if(sc==true){
          this.state.message="Chart Added to Dashboard";  
          items = this.state.items.filter(item => item._id == result);
          console.log(items)
          closedItem=items[0]    
          closedItem.showChart=true
          }else{
          this.state.message="Chart Removed from Dashboard";     
          closedItem.showChart=false
          }

          this.handleUpdateChart(closedItem)  

    }
    handleUpdateChart = async (updatedObject) => {
        console.log(updatedObject)
        var id=updatedObject._id
        const {name, time,type,showChart,chartData } = updatedObject
        console.log(this.state)
        const payload = { 
            name, 
            type,
            showChart,
            chartData
            }
      
        await api.updateChartById(id, payload).then(res => {
            console.log(res)
            toast.success(this.state.message, {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              this.componentDidMount()
            this.setState({
                name: '',
                
            })
        })
      }
    onDragEnd = (result) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        if(destination.droppableId == 'droppable2'&&source.droppableId != destination.droppableId){
            console.log(result.draggableId)
            this.onCloseCard(result.draggableId,true)
       
        }
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
               
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
         
            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
      
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>

                <div className="DashboardLeftPanel">
                <ToastContainer/>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.items.map((item, index) => (
                                <Draggable
                                    key={item._id}
                                    draggableId={item._id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                        className='chartItems'
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.name}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                </div>
                <div className="DashboardRightPanel">
                <Droppable droppableId="droppable2">
                  
                
                    {(provided, snapshot) =>  (
                        <div
                           
                            ref={provided.innerRef}
                            style={getDashboardChartListStyle(snapshot.isDraggingOver)}>
                            {this.state.selected.map((item, index) =>  (
                                <Draggable 
                                
                                    key={item._id}
                                    draggableId={item._id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                        className='dashboardChartCards'
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getChartDashboardStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                                 <Card style={{ width: "80%", color: "black", border: "0px" }}>
                                  <Card.Body>
                                    
                                    <Card.Title >
                                      {item.name} <CloseCard  key={item._id}
            value={item._id}
            onDelete={this.onCloseCard}
            id={item._id} /> 
                                    </Card.Title>
                                  </Card.Body>

                                  <Card.Body style={{ display: item.type =="1" ? "block" : "none" }}>
                                    <LineChart
                                      width={450}
                                      height={250}
                                      data={item.chartData}
                                      margin={{
                                        top: 5,
                                        right: 20,
                                        left: 20,
                                        bottom: 5,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                                    </LineChart>
                                  </Card.Body>
                                  <Card.Body style={{ display: item.type =="2" ? "block" : "none" }}>
                                    <BarChart
                                      width={450}
                                      height={250}
                                      data={item.chartData}
                                      margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="name" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Bar dataKey="pv" fill="#8884d8" />
                                      <Bar dataKey="uv" fill="#82ca9d" />
                                    </BarChart>
                                  </Card.Body>
                                  <Card.Body style={{ display: item.type =="3" ? "block" : "none",height:'290px' }} className="piechart">
                                    <PieChart width={450} height={300}>
                                      <Pie
                                        data={item.chartData}
                                        cx={200}
                                        cy={200}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {item.chartData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                      </Pie>
                                    </PieChart>
                                  </Card.Body>
                                </Card>
                                <div className="dragHere" style={{ display: item._id == "empty" ? "block" : "none" }}>
                          Drag here
                        </div>
                                        </div>
                                        
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                        
                    )}
                </Droppable>
                
                </div>
            </DragDropContext>
        );
    }
}

// Put the things into the DOM!



export default Dashboard;