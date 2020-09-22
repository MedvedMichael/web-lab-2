import templateEngine from './template-engine'
import { getDataFromLocalStorage, parseQuery, generateID, pushToURL, saveToLocalStorage } from './helpers'
import Note from './note'
import previewListTemplate from '../templates/preview-list.html'


const res = getDataFromLocalStorage('notes')
const notes = res ? res.map(item => new Note({ ...item._data, selected: false })) : []

if(!res)
    saveToLocalStorage('notes', [])

const addNote = () =>
{
    const date = new Date();
    const newNote = new Note({ title: 'Note', text: '', id: generateID(notes.map(item => item.getID())), createdAt: date, editedAt: date })
    
    notes.splice(0,0,newNote)
    for(let i in notes){
        notes[i].setIsSelected(false)
    }
    notes[0].setIsSelected(true)
    saveToLocalStorage('notes', notes)
}
const updatePage = () => {

     
     const { search } = window.location,
        query = parseQuery(search)

    const currentNote = query.id ? notes.find(item => item.getID() && item.getID() === query.id) : null
    if (currentNote)
        currentNote.setIsSelected(true)

    document.getElementById('main-list').innerHTML = templateEngine(previewListTemplate, { notes })

    const previewItems = document.getElementsByClassName('preview-list-item'),
        deleteButtons = document.getElementsByClassName('delete-note-button')
    for (let i in previewItems) {
        if (!previewItems[i].className || previewItems[i].id.includes('add-note-button'))
            continue;
        previewItems[i].addEventListener('click', (e) => {
            if (e.target.className.includes('delete')) return

            const cNote = notes.find(note => note.isSelected())
            if (cNote) {
                cNote.setIsSelected(false)
                if (cNote.getTitle() === '')
                    cNote.setTitle('Note')
            }

            notes[i].setIsSelected(true)
            pushToURL('', 'id', notes[i].getID())
            saveToLocalStorage('notes', notes)
            updatePage({ notes })
        })

        deleteButtons[i].addEventListener('click', () => {
            notes.splice(i, 1)
            pushToURL('', '', '')
            saveToLocalStorage('notes', notes)
            updatePage({ notes })
        })
    }

    document.getElementById('add-note-button').addEventListener("click", () => {
        addNote(notes)
        pushToURL('', 'id', notes[notes.length - 1].getID())
        updatePage()
    })

    const text = currentNote ? currentNote.getText() : '',
        title = currentNote ? currentNote.getTitle() : ''

    const textArea = document.getElementById('main-textarea'),
        titleArea = document.getElementById('title-input')

    textArea.oninput = null
    titleArea.oninput = null
    textArea.value = text
    titleArea.value = title

    
        
    
    if (currentNote) {
        textArea.disabled = false
        titleArea.disabled = false

        
    }
    else {
        textArea.disabled = true
        titleArea.disabled = true
    }

}
const handlerForInput = (element, preview) => {
    const {value} = element
    preview.innerText = value.replaceAll('\n',' ').slice(0, 15) + ((value.length > 15) ? ' ...' : '') + ((value.length === 0) ? 'Note' : '')
}

const handlerForTitleInput = (titleArea) => {
    const currentNoteIndex = notes.findIndex(note => note.isSelected())
    if (currentNoteIndex !== -1) {
        const currentNote = notes[currentNoteIndex]
        handlerForInput(titleArea, document.getElementById(`note-title_${currentNote.getID()}`))
        currentNote.setTitle(titleArea.value)
        const date = new Date()
        currentNote.setEditedDate(date)
        document.getElementById(`note-edited_${currentNote.getID()}`).innerText = 'Edited at ' + date.toString().split('GMT')[0]
        if(currentNoteIndex!==0){
            const note = notes.splice(currentNoteIndex,1)[0]
            notes.splice(0, 0, note)
            updatePage()
        }
        
    }
}

const handlerForTextInput = (textArea) => {
    const currentNoteIndex = notes.findIndex(note => note.isSelected())
    if (currentNoteIndex !== -1) {
        const currentNote = notes[currentNoteIndex]
        handlerForInput(textArea, document.getElementById(`note-text_${currentNote.getID()}`))
        currentNote.setText(textArea.value)
        const date = new Date()
        currentNote.setEditedDate(date)
        document.getElementById(`note-edited_${currentNote.getID()}`).innerText = 'Edited at ' + date.toString().split('GMT')[0]
        if(currentNoteIndex!==0){
            const note = notes.splice(currentNoteIndex,1)[0]
            console.log(note)
            notes.splice(0, 0, note)
            updatePage()
        }
    }
}

const onChange = () => saveToLocalStorage('notes', notes)





const textArea = document.getElementById('main-textarea'),
        titleArea = document.getElementById('title-input')

titleArea.addEventListener('input', () => handlerForTitleInput(titleArea))
textArea.addEventListener('input', () => handlerForTextInput(textArea))

textArea.addEventListener('change', () => onChange())
titleArea.addEventListener('change', () => onChange())



updatePage({notes})

