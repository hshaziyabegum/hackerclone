import React, { Component } from 'react';
import LineChart from  './LineChart';
import {Table} from 'react-bootstrap';

class MyBlog extends Component {
    constructor(){
        super()
        this.state = {
            data : '', 
            currentPage: 1, remainingdata:'',  localdatawithvote :[], vote:[]
        }
        this.addPage = this.addPage.bind(this);
        this.removePage = this.removePage.bind(this);
        this.hideBlog = this.hideBlog.bind(this);
        this.upVote =  this.upVote.bind(this);
    }
    upVote(objId){
       var newvotes =  this.state.localdatawithvote.map(    
        voteObj => { 
                if(voteObj.objectID === objId ){
                   voteObj.vote ++;

             }
               return voteObj;
            }
          )
          this.setState({
            localdatawithvote : newvotes
          })
         localStorage.setItem('data', JSON.stringify(newvotes));
         var newlocalvotes = this.state.vote.map(    
            voteObj => { 
                    if(voteObj.id === objId ){
                       voteObj.vote ++;
                       
                 }
                   return voteObj;
                }
              )
              this.setState({
                vote : newlocalvotes
              })
              localStorage.setItem('vote', JSON.stringify(this.state.vote));
            console.log('after settingoin votes array', this.state.vote)
        
       
    }
    removePage(){
        console.log('remove')
        this.setState({
            currentPage: this.state.currentPage-1
        }) 
        console.log('remove', this.state.currentPage)
        this.fetchdata(this.state.currentPage)
    }
    addPage(){
        console.log('add')
        this.setState({
            currentPage: this.state.currentPage+1
        })
        console.log('addpage', this.state.currentPage)
        this.fetchdata(this.state.currentPage)
    }
    hideBlog(e){
        console.log('e',this.state.data.hits)
        console.log('e',e.objectID)
       var remaindatta = this.state.data.hits.filter(elem=> elem.objectID!=e.objectID)
        // this.setState({
        //     remainingdata : remaindatta
        // })
         
       console.log('remain', remaindatta)
    localStorage.setItem('data', JSON.stringify(remaindatta));
       
    }
    componentWillMount(){
       if( JSON.parse( localStorage.getItem('data'))){
        this.setState({
                localdatawithvote : JSON.parse( localStorage.getItem('data'))
        })
    }
    
    
    }

    fetchdata(updatePge){
        console.log('this.state.currentPage', updatePge)
        fetch('https://hn.algolia.com/api/v1/search?page='+this.state.currentPage)
        .then( response=>response.text().then(text=> {
            this.setState({data:text && JSON.parse(text)})
            const data = text && JSON.parse(text);
            console.log(data)
            if (!response.ok) {
    
            
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
                    }
            
            return data;
                }))
        .then(data=> {
        console.log('datta in fetch', data)
        var newlocalwill = data.hits.map(obj =>{
            obj= { ...obj, "vote" : 0};
            return obj
        })
        console.log('newlocalwill', newlocalwill)
        localStorage.setItem('data', JSON.stringify(newlocalwill));
        data.hits.map(obj =>{
            this.state.vote= [...this.state.vote,{id: obj.objectID, vote:0}]
            })
           
        return newlocalwill;
        });
        console.log('this.state.vote', this.state.vote)
 }
   
    componentDidMount(){
    this.fetchdata(this.state.currentPage);
   
    }

    render() {
       var localData = this.state.localdatawithvote;
       let splitUrl ='';
        return (
            <div className=" container hackerClone">
                <Table>
                    <tr>
                    <th>
                        Comments
                    </th>
                    <th>
                        Vote Count
                    </th>
                    <th>
                        UpVote
                    </th>
                    <th>
                        New Details
                    </th>
                    </tr>
                
                {localData && localData.map(
                    
                    hitdata => <tr>
                        <td>{hitdata.num_comments} </td>
                        <td>
                        {
                            hitdata.vote
                        }
                        </td>
                        <td><p onClick={(e)=>this.upVote(hitdata.objectID)}>upvote</p></td>
                        <td>{hitdata.title} 
                       {  splitUrl = (hitdata.url) && (hitdata.url).split('/')
                       }
                        {(hitdata.url) ?  <a href= {hitdata.url} target="_blank">  {splitUrl[2]} </a>:''}
                           by {hitdata.author} 
                        <span onClick={(e)=>this.hideBlog(hitdata)}>(hide)</span>
                        </td>
                    
                    
                    
                    </tr>)
                }
                </Table>
                <div className="prev-next">
                    <span onClick={(e)=>this.removePage(e)} className="prevoius"> Previous</span>
                   <span onClick={(e)=>this.addPage(e)} className="next"> Next</span>
                </div>
                   
                   <LineChart chartData={this.state.localdatawithvote}/>
            </div>
        );
    }
}

export default MyBlog;