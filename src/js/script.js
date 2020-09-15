import templateEngine from './template-engine'
import { getDataFromLocalStorage, parseQuery, generateID, pushToURL, saveToLocalStorage } from './helpers'
import Note from './note'
import previewListTemplate from '../templates/preview-list.html'


const addNote = (notes) =>
    [...notes.map(note => { note.setIsSelected(false); return note }),
    new Note({ title: 'Note', text: '', id: generateID(notes.map(item => item.getID())), selected: true })]

const updatePage = (props) => {

    const notes = props.notes ? props.notes : getDataFromLocalStorage('notes').map(item => new Note({ ...item._data, selected: false })),
        { search } = window.location,
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
        const newNotes = addNote(notes)
        pushToURL('', 'id', newNotes[newNotes.length - 1].getID())
        updatePage({ notes: newNotes })
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
        
        titleArea.addEventListener('input',() => handlerForTitleInput(titleArea, notes))
        textArea.addEventListener('input', () => handlerForTextInput(textArea, notes))
       
        textArea.addEventListener('change', () => { saveToLocalStorage('notes', notes) })
        titleArea.addEventListener('change', () => { saveToLocalStorage('notes', notes) })
    }
    else {
        textArea.disabled = true
        titleArea.disabled = true
    }

}
const handlerForInput = (element, preview) => {
    const {value} = element
    preview.innerText = value.replace('\n',' ').slice(0, 15) + ((value.length > 15) ? ' ...' : '') + ((value.length === 0) ? 'Note' : '')
}

const handlerForTitleInput = (titleArea, notes) => {
    const currentNote = notes.find(note => note.isSelected())
    handlerForInput(titleArea, document.getElementById(`note-title_${currentNote.getID()}`))
    currentNote.setTitle(titleArea.value)
}

const handlerForTextInput = (textArea, notes) => {
    const currentNote = notes.find(note => note.isSelected())
    handlerForInput(textArea, document.getElementById(`note-text_${currentNote.getID()}`))
    currentNote.setText(textArea.value)
}



updatePage({})

