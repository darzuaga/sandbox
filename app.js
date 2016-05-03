import editor from 'npm:medium-editor'
import $ from 'jquery'
import Firebase from 'firebase'
var fbRef = new Firebase('https://biznobo-sandbox.firebaseio.com')
var emailEndpoint = 'email_tests'
// var emailEndpoint = 'email_tests_sandbox'

var email = new editor('#email_body', {
    placeholder: {
        text: 'Write your email...'
    }
})

$('#medium_editor_container').on('submit', (e) => {
    e.preventDefault()
    let html = $('#email_body_container > div').html()
    let subject = $('#email_subject').val()
    let id = $('#test_id').val()
    let size = $('#test_size').val()
    let payload = {html, subject, id, size}
    fbRef.child(`${emailEndpoint}/${id}`).update(payload)
})
