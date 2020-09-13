


// const notes = []
// const previewListTemplate = document.getElementById('preview-tpl')
// document.getElementById('main-list').innerHTML = templateEngine(previewListTemplate.innerHTML, {notes})

function handlerForPreviews(item, index, notes) {
    return () => {
        const { id } = item
        const noteIndex = notes.findIndex(element => element.id.toString() === id)
        const textArea = document.getElementById('main-textarea'),
              titleArea = document.getElementById('title-input')
        
        if(index!==-1) {
            notes[index].text = textArea.value
            notes[index].title = titleArea.value
        }
        localStorage.setItem('notes', JSON.stringify(notes))
        updatePage({ selected: noteIndex })
    }
}

function addNote () {
    const res = localStorage.getItem('notes')
    const notes = res ? JSON.parse(res) : []
    notes.push({ title: 'New note', id: notes.length, text:'' })
    localStorage.setItem('notes', JSON.stringify(notes))
    updatePage({ selected: notes.length-1 })
}

function updatePage(props) {
    // const notes = [
    //     {
    //         title: 'item 1',
    //         id:1,
    //         text:"Kuku1"
    //     },
    //     {
    //         title: 'item 2',
    //         id:2,
    //         text:"Kuku2"
    //     },
    //     {
    //         title: 'item 3',
    //         id:3,
    //         text:"Kuku3"
    //     }
    // ];
    const res = localStorage.getItem('notes')
    const notes = res ? JSON.parse(res) : []
    
    const previewListTemplate = document.getElementById('preview-tpl')
    document.getElementById('main-list').innerHTML = templateEngine(previewListTemplate.innerHTML, {notes, ...props})
    const previewItems = document.getElementsByClassName('preview-list-item')
    for (let i in previewItems){
        if(!previewItems[i].className || previewItems[i].className.includes('add-note-button'))
            continue;
        
        previewItems[i].onclick = handlerForPreviews(previewItems[i], props.selected, notes)
    }
    // console.log(notes[props.selected])
    console.log(props)
    const text = props.selected !== -1 ? notes[props.selected].text : '',
          title = props.selected !== -1 ? notes[props.selected].title : ''
    document.getElementById('main-textarea').value = text
    document.getElementById('title-input').value = title
    
}

updatePage({selected:-1})



// console.log(templateEngine(template,{name:"Mike", age: 19}))
