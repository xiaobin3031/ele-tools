//

export default function Tips({ title }){
  
  const style = {
    border: "1px solid black",
    borderRadius: "100%",
    textAlign: "center",
    verticalAlign: "middle",
    paddingLeft: "5px",
    paddingRight: "5px",
    fontSize: "0.8em",
    marginLeft: "3px"
  };

  return (
    <span 
      style={ style }
      title={title}
    >?</span>
  )
}