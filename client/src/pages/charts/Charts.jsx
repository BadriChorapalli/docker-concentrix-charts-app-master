import "./Charts.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import CSVReader from "react-csv-reader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


let chartData=[];
let labelList=[]
const handleForce = (data, fileInfo) => {
    
  labelList=[]
  console.log(data, fileInfo);
  chartData=data;
  Object.keys(data[0]).forEach(function(key) {
   console.log(key)
   var label={}
   label.value=key;
   label.name=key;
   labelList.push(label)
   console.log(labelList)
    // ...
});
setLabelList(labelList)


  toast.success(fileInfo.name + " data uploaded successfully. ", {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
const getChartJSONData = () => {
return chartData
}
const setChartJSONData = (data) =>{
    chartData=data
}
const getLabelList = () => {
    return labelList
}
const setLabelList = (list) => {
    labelList=list
}

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



const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
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

const getItemStyle = (isDragging, draggableStyle, chartItem) => ({
 
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  fontWeight: "bold",
  color: chartItem._id == 0 ? "white" : "black",
  background: isDragging ? "lightblue" : "#ECECF8",
  background:  chartItem._id == 0  ? "#007bff" : "#ECECF8",
  marginBottom: chartItem._id == 0  ? "20px" : "${grid}px",
  // styles we need to apply on draggables
  ...draggableStyle,
});
const getChartItemStyles = (isDragging, draggableStyle, chart) => ({
  
  userSelect: "none",
  padding: grid,
  margin: `${grid}px`,
  float: "left",
  height: "auto",
  color: "red",
  // change background colour if dragging
  background: isDragging ? "lightblue" : "#ECECF8",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#C7C9CB" : "#ECECF8",
  padding: grid,
  width: "90%",
});
const getChartsChartListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#C7C9CB" : "#ECECF8",
  padding: grid,
  width: "100%",
  float: "left",
  height: 900,
});
class UpdateChart extends Component {
   

    render() {
        return <Button variant="warning" className="update" onClick={this.updateSelectedChart} >Update</Button> 
    }
}

class DeleteChart extends Component {
    render() {
        return <Button variant="danger" className="delete"  onClick={() => this.props.onDelete(this.props.id)} >X</Button> 
    }
}
class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.chartFields = { value: 0 };

    this.handleChange = this.handleChange.bind(this);
    
    this.state = {
      _id:0,
      save:true,  
      value: 1,
      items: [],
      selected: [],
      name: '',
      
      type:0,
      showChart:false,
      chartData: this.chartData
    };
  }
 
  handleDelete = itemId => {
    confirmAlert({
      overlayClassName: "react-confirm-alert-overlay",
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this Chart?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                api.deleteChartById(itemId).then((charts) => {
                  const items = this.state.items.filter(item => item._id !== charts.data.data._id);
                  this.setState({ items: items });
                 
              });
              onClose();
                
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
    
   
    //this.setState({ items: items });
           
        
 
   
  };
  id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  getList = (id) => this.state[this.id2List[id]];

  componentDidMount = async () => {
    // this.setState({ isLoading: true })
    let displayCharts =[];
    let initialChart = [];
    let newChart = {};
    newChart._id = "0";
    newChart.name = "Create Chart";
    newChart.save = true;
    
    let emptyChart = {};
    emptyChart._id = "empty";
    initialChart.push(emptyChart);
    await api.getAllCharts().then((charts) => {
        displayCharts = charts.data.data;
        displayCharts.unshift(newChart);
      this.setState({
        items: displayCharts,
        selected: initialChart,
      });
    }).catch(error => {
        console.log(error.message)
        displayCharts.push(newChart);
        this.setState({
            items: displayCharts,
            selected: initialChart,
          });
    });
  };
  onCancelChart= () => {
    this.componentDidMount()
  }
  onDragEnd = (result) => {
   
    const selectedItem = this.state.items.filter(item => item._id == result.draggableId);
   
    if(result.draggableId!=0){
        setChartJSONData(selectedItem[0].chartData)
    selectedItem[0].save=false
    this.setState(selectedItem[0]);
    }else{
        selectedItem.save=true;
        this.setState(selectedItem[0]);
    }
    const { source, destination } = result;
    var chartForm = [];
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(this.getList(source.droppableId), source.index, destination.index);

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(this.getList(source.droppableId), this.getList(destination.droppableId), source, destination);
      console.log(result);
      
      chartForm.push(result.droppable2[0]);
      if (result.droppable2[1] && result.droppable2[1]._id != "empty") {
        if (result.droppable2[1]._id == 0) {
          result.droppable.unshift(result.droppable2[1]);
        } else {
          result.droppable.push(result.droppable2[1]);
        }
      }
      this.setState({
        items: result.droppable,
        selected: chartForm,
      });
    }
  };

  handleChange(event) {
      console.log(event.target.name)
      console.log(event.target.type)
      console.log(event.target.checked)
      var n=event.target.name
      var Obj={}
      if(event.target.type=="checkbox"){
        Obj[n]= event.target.checked 
      }else{
        Obj[n]= event.target.value 
      }
      
      this.setState(Obj);
    }
  
  handleCreateChart = async () => {
    const { name, time,type,showChart,chartData } = this.state
    console.log(this.state)
    const payload = { 
        name, 
        type,
        showChart,
        chartData:getChartJSONData()
        }

    await api.insertChart(payload).then(res => {
        
        toast.success("success", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.componentDidMount()
        this.setState({
            name: '',
            type:0,
            showChart:false,
        })
    })
}
handleUpdateChart = async () => {
  const {_id,name, time,type,showChart,chartData } = this.state
  console.log(this.state)
  const payload = { 
      name, 
      type,
      showChart,
      chartData:getChartJSONData()
      }

  await api.updateChartById(_id, payload).then(res => {
      
      toast.success("success", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
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
  // Normally you would want to split things out into separate components.
  // But due to hackthon everything is just done in one place for quick and simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="ChartsLeftPanel">
          
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {this.state.items.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className="chartItems"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, item)}
                      >
                       
                        <Row >
    <Col  xs={8}> {item.name}</Col>
    <Col  style={{ display: item._id != 0 ? "block" : "none" }}><DeleteChart  key={item._id}
            value={item._id}
            onDelete={this.handleDelete}
            id={item._id} /> </Col>
  </Row>
                       
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="ChartsRightPanel">
          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getChartsChartListStyle(snapshot.isDraggingOver)}>
                {this.state.selected.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={item._id != "empty" ? "createChartCards" : "dragChartCards"}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getChartItemStyles(snapshot.isDragging, provided.draggableProps.style, item)}
                      >
                        <div style={{ display: item._id != "empty" ? "block" : "none" }}>
                          <Container>
                            <Row>
                              <Col>
                                {" "}
                                <Card style={{ width: "100%", color: "black", border: "0px" }}>
                                  <Card.Body>
                                    <Card.Title style={{ display: item._id == 0 ? "block" : "none" }}>
                                      Create New Chart
                                    </Card.Title>
                                    <Card.Title style={{ display: item._id != 0 ? "block" : "none" }}>
                                      {item.name}
                                    </Card.Title>
                                  </Card.Body>
                                  <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                      <Form.Group as={Row}>
                                        <Form.Label column sm="2">
                                          Name
                                        </Form.Label>
                                        <Col sm="10">
                                          <Form.Control defaultValue={this.state.name}  name="name" onChange={this.handleChange} type="text" />
                                        </Col>
                                      </Form.Group>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                      <Form.Group as={Row}>
                                        <Form.Label column sm="2">
                                          Type
                                        </Form.Label>
                                        <Col sm="10">
                                          <Form.Control
                                            as="select"
                                            name="type"
                                            defaultValue={this.state.type}
                                            onChange={this.handleChange}
                                          >
                                            <option value="0">Choose...</option>
                                            <option value="1">Line Chart</option>
                                            <option value="2">Bar Chart</option>
                                            <option value="3">Pie Chart</option>
                                          </Form.Control>
                                        </Col>
                                      </Form.Group>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                      <Form.Group as={Row}>
                                        <Form.Label column sm="4">
                                          Data
                                        </Form.Label>
                                        <Col sm="8">
                                        <Row>
    <Col sm="8"><CSVReader
                                            cssClass="react-csv-input"
                                            onFileLoaded={handleForce}
                                            parserOptions={papaparseOptions}
                                           
                                          /></Col>
    <Col sm="4"> <Button id="loadLabels" style={{ display: "none" }}  onClick={this.handleChange}>Load Labels</Button> </Col>
  </Row>
                                         
                                          <ToastContainer
                                            position="top-right"
                                            autoClose={5000}
                                            hideProgressBar={false}
                                            newestOnTop
                                            closeOnClick
                                            rtl={false}
                                            pauseOnFocusLoss
                                            draggable
                                            pauseOnHover
                                          />
                                        </Col>
                                      </Form.Group>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                      <Form.Group as={Row}>
                                        <Form.Label column sm="2">
                                          X-Axis
                                        </Form.Label>
                                        <Col sm="5">
                                          <Form.Control placeholder="Lable Name" />
                                        </Col>
                                        <Col sm="5">
                                          <Form.Control as="select" defaultValue="Choose...">
                                            <option>Choose...</option>
                                            {getLabelList().map(({ value, name }, index) => <option value={value} >{name}</option>)}
                                          </Form.Control>
                                        </Col>
                                      </Form.Group>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                      <Form.Group as={Row}>
                                        <Form.Label column sm="2">
                                          Y-Axis
                                        </Form.Label>
                                        <Col sm="5">
                                          <Form.Control placeholder="Lable Name" />
                                        </Col>
                                        <Col sm="5">
                                          <Form.Control as="select" defaultValue="Choose...">
                                            <option>Choose...</option>
                                            {getLabelList().map(({ value, name }, index) => <option value={value} >{name}</option>)}
                                          </Form.Control>
                                        </Col>
                                      </Form.Group>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                      <Form.Group as={Row} controlId="formBasicCheckbox">
                                        <Col sm="8">
                                          <Form.Check
                                            defaultValue={this.state.showChart}
                                            name="showChart" onChange={this.handleChange}
                                            type="checkbox"
                                            id="customControlAutosizing"
                                            label="Display on Dashboard"
                                            custom
                                          />
                                        </Col>
                                      </Form.Group>
                                    </ListGroupItem>
                                  </ListGroup>
                                  <Card.Footer className="formFooter">
                                  <Row>
    <Col><Button variant="success" onClick={this.handleChange} >Preview</Button> </Col>
    <Col> <Button variant="danger" onClick={this.onCancelChart} >Cancel</Button></Col>
    <Col><Button variant="primary" onClick={this.handleCreateChart} style={{ display: this.state.save? "block" : "none" }}>Save</Button>
                                    <div style={{ display:this.state.save? "none" : "block" }}>
                                    <Button variant="primary" onClick={this.handleUpdateChart} style={{ display: !this.state.save? "block" : "none" }}>Update</Button>
                                    </div></Col>
  </Row>
                                   
                                   
                                    
                                  </Card.Footer>
                                </Card>
                              </Col>
                              <Col>
                                <Card style={{ width: "100%", color: "black", border: "0px" }}>
                                  <Card.Body>
                                  <Card.Title style={{ height: "60px", color: "#007bff"}}>
                                      Chart Preview
                                    </Card.Title>
                                    <Card.Title style={{ display: this.state.type == 0 ? "block" : "none" }}>
                                      Chart Type Not Selected
                                    </Card.Title>
                                    <Card.Title style={{ display: this.state.type != 0 ? "block" : "none" }}>
                                      Title : {this.state.name}
                                    </Card.Title>
                                  </Card.Body>

                                  <Card.Body style={{ display: this.state.type == "1" ? "block" : "none" }}>
                                  <Card.Title>
                                     Line Chart
                                    </Card.Title>
                                    <LineChart
                                      width={450}
                                      height={250}
                                      data={getChartJSONData()}
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
                                  <Card.Body style={{ display: this.state.type == "2" ? "block" : "none" }}>
                                  <Card.Title>
                                     Bar Chart
                                    </Card.Title>
                                    <BarChart
                                      width={450}
                                      height={300}
                                      data={getChartJSONData()}
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
                                  <Card.Body style={{ display: this.state.type == "3" ? "block" : "none" }}>
                                  <Card.Title>
                                     Pie Chart
                                    </Card.Title>
                                    <PieChart width={400} height={400}>
                                      <Pie
                                        data={getChartJSONData()}
                                        cx={200}
                                        cy={200}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {getChartJSONData().map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                      </Pie>
                                    </PieChart>
                                  </Card.Body>
                                </Card>
                              </Col>
                            </Row>
                          </Container>
                        </div>
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

export default Charts;
