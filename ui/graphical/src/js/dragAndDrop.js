export function dragComponent(event){
    event.dataTransfer.effectAllowed = 'move';
     
     let element = event.target;
     if(element.classList.contains('drop-area')){
       console.log(element.id);
        event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
        
     } else{
       while(element.parentNode){
          element = element.parentNode;
          console.log(element.id);
          if(element.classList.contains('drop-area')){
            event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
            break;
          }
        }
     }
}

export function dropComponent(event){
  event.preventDefault();
  event.stopPropagation();
  let dropData = event.dataTransfer.getData('text/html');
  let dropItems = dropData.split("|");
  let draggedZone = document.getElementById(dropItems[0]);
  let droppedElement = document.getElementById(event.target.id);
  let draggedID = dropItems[1];
  
  if(droppedElement != null && droppedElement.classList.contains('drop-area')){
    if(event.target.childNodes.length > 0){
      draggedZone.appendChild(event.target.childNodes[0]);
    }
    console.log(draggedID);
    droppedElement.appendChild(document.getElementById(draggedID));
  } 
  else if(droppedElement){
    let element = droppedElement;
    while(element.parentNode){
      element = element.parentNode;
      if(element.classList.contains('drop-area')){
        console.log(element.childNodes[0]);
        draggedZone.appendChild(element.childNodes[0]);
        element.appendChild(document.getElementById(draggedID));
        
        break;
      }
    }
  }
  return false;
}