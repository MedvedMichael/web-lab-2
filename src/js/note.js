

export default class Note {
    constructor(data) {
        this._data = data
        this._selected = data.selected ? data.selected : false
    }
    
    setIsSelected (selected) {
        this._selected = selected
    }

    isSelected () {
        return this._selected
    }

    getID (){
        return this._data.id
    }

    getData () {
        return this._data
    }

    getTitle() {
        return this._data.title
    }
    getText() {
        return this._data.text
    }
    setText(text){
        this._data.text = text
    }
    setTitle(title) {
        this._data.title = title
    }
}
