

export default class Note {
    constructor(data) {
        this._data = data
        this._selected = data.selected ? data.selected : false
        this._createdAt = typeof data.createdAt === 'object' ? data.createdAt : new Date(data.createdAt)
        this._editedAt = typeof data.editedAt === 'object' ? data.editedAt : new Date(data.editedAt)
    }

    setIsSelected(selected) {
        this._selected = selected
    }

    getCreatedDate() {
        return this._createdAt;
    }

    getEditedDate() {
        return this._editedAt
    }

    setEditedDate(editedAt){
        this._editedAt = editedAt
    }

    isSelected() {
        return this._selected
    }

    getID() {
        return this._data.id
    }

    getData() {
        return this._data
    }

    getTitle() {
        return this._data.title
    }
    getText() {
        return this._data.text
    }
    setText(text) {
        this._data.text = text
    }
    setTitle(title) {
        this._data.title = title
    }
}
