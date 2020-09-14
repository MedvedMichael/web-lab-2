
import templateEngine from './template-engine'
import {getDataFromLocalStorage, parseQuery, generateID, pushToURL, saveToLocalStorage} from './helpers'
import Note from './note'


const addNote = (notes) => 
    [...notes.map(note => { note.setIsSelected(false); return note }), 
        new Note({ title: 'Note', text: '', id: generateID(notes.map(item => item.getID())), selected: true })]

const updatePage = (props) => {

    const notes = props.notes ? props.notes : getDataFromLocalStorage('notes').map(item => new Note({...item._data, selected: false})),
          {search} = window.location,
          query = parseQuery(search),
          previewListTemplate = document.getElementById('preview-tpl'),
          previewItems = document.getElementsByClassName('preview-list-item')


    console.log(notes[0])
    const currentNote = query.id ? notes.find(item => item.getID() && item.getID() === query.id) : null
    if (currentNote) 
        currentNote.setIsSelected(true)
    
    
    document.getElementById('main-list').innerHTML = templateEngine(previewListTemplate.innerHTML, {notes})
    
    for (let i in previewItems) {
        if(!previewItems[i].className || previewItems[i].id.includes('add-note-button'))
            continue;
        previewItems[i].onclick = () => {
            const cNote = notes.find(note => note.isSelected())
            if(cNote) 
                cNote.setIsSelected(false)
            
            notes[i].setIsSelected(true)
            pushToURL('','id', notes[i].getID())
            saveToLocalStorage('notes', notes)
            updatePage({notes})
        }
    }

    document.getElementById('add-note-button').addEventListener("click", () => {
        const newNotes = addNote(notes)
        pushToURL('', 'id', newNotes[newNotes.length - 1].getID())
        updatePage({ notes:  newNotes})
    })
    
    const text = currentNote ? currentNote.getText() : '',
          title = currentNote ? currentNote.getTitle() : ''

    const textArea = document.getElementById('main-textarea'),
          titleArea = document.getElementById('title-input')
    textArea.value = text
    titleArea.value = title
    // if(selected !== -1)

    if (currentNote) {
        textArea.disabled = false
        titleArea.disabled = false
        titleArea.oninput = () => {
            const {value} = titleArea
            const previewTitle = document.getElementById(`note-title_${currentNote.getID()}`)
            previewTitle.innerText = value.slice(0, 15) + ((value.length > 15) ? ' ...' : '') + ((value.length === 0) ? 'Note' : '')
            currentNote.setTitle(value)
        }
        textArea.oninput = () => {
            const {value} = textArea
            const previewText = document.getElementById(`note-text_${currentNote.getID()}`)
            previewText.innerText = value.slice(0, 17) + ((value.length > 17) ? ' ...' : '')
            currentNote.setText(value)
        }
    }
    else {
        textArea.disabled = true
        titleArea.disabled = true
    }
    
    window.addEventListener('close', () => saveToLocalStorage('notes', notes))
}



updatePage({})

