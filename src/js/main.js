

const notes = [
    {
        title: 'item 1'
    },
    {
        title: 'item 2',
    },
    {
        title: 'item 3',
    }
];
const previewListTemplate = document.getElementById('preview-tpl')
document.getElementById('main-list').innerHTML = templateEngine(previewListTemplate.innerHTML, {notes})




// console.log(templateEngine(template,{name:"Mike", age: 19}))
