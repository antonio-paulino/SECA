

function getUrl(type, size, page, path, name) {
    let pageNum = parseInt(page)
    let url = (type == 'previous') ? `${path}?s=${size}&p=${pageNum - 1}` : `${path}?s=${size}&p=${pageNum + 1}`;
    if(name) url = `${url}&name=${name}`
    window.location.href = url
}


function validateGroupForm(formID, groupID) {
    
    const form = (formID == `editGroup`) ? document.getElementById(`editGroup${groupID}`) : document.getElementById(formID);

    const groupName = (form) ? form.querySelector('input[name="name"]').value : document.getElementById(`group${groupID}-name`).value;
    const groupDescription = (form) ? form.querySelector('input[name="description"]').value : document.getElementById(`group${groupID}-desc`).value;;

    const errorMessage = (formID == `editGroup${groupID}`) ? document.getElementById(`errorMessage${groupID}`) : document.getElementById(`errorMessage`);

    if (groupName.trim() == '' || groupDescription.trim() == '') {
        errorMessage.textContent = `You must provide both Group Name and Description`;
        errorMessage.style.display = "block";
        return false;
    }

    errorMessage.style.display = 'none';
    return true;

}


 

function validateForm(formId) {

    const form = document.getElementById(formId);

    const s = parseInt(form.querySelector('input[name="s"]').value);
    const p = parseInt(form.querySelector('input[name="p"]').value);

    const maxResults = 1000;
    const maxResultsPerPage = 200;

    const errorMessage = document.getElementById("errorMessage");

    if(isNaN(s) || s > maxResultsPerPage) {
        errorMessage.textContent = `Invalid values. Maximum number of results per page is ${maxResultsPerPage}`;
        errorMessage.style.display = "block";
        return false;
    }

    if(formId == 'nameForm') {
        const name = form.querySelector('input[name="name"]').value
        if(!name) {
            errorMessage.textContent = `No name provided`;
            errorMessage.style.display = "block";
            return false
        }
    }

    if (isNaN(s) || isNaN(p) || s * p >= maxResults) {
        errorMessage.textContent = `Invalid values. Maximum number of results is ${maxResults}`;
        errorMessage.style.display = "block";
        return false;
    }

    errorMessage.style.display = "none";
    return true;
}

function toggleEditForm(groupId) {
    const groupDetails = document.getElementById(`group${groupId}`);
    const groupName = groupDetails.querySelector('.group-name');
    const groupDescription = groupDetails.querySelector('.group-description');
    const editName = document.getElementById(`group${groupId}-name`);
    const editDesc = document.getElementById(`group${groupId}-desc`);
    const submitButton = document.getElementById(`group${groupId}-submit`);
    const editButton = groupDetails.querySelector('button');
    

    editButton.style.display = 'none';
    editName.style.display = 'block';
    editDesc.style.display = 'block';
    submitButton.style.display = 'block';
    groupName.style.display = groupName.style.display === 'none' ? 'block' : 'none';
    groupDescription.style.display = groupDescription.style.display === 'none' ? 'block' : 'none';
}

 
 function showForm(formType) {
    
    const popularForm = document.getElementById("popularForm");
    const nameForm = document.getElementById("nameForm");

    if (formType === "popular") {
      popularForm.style.display = "block";
      nameForm.style.display = "none";
    } else if (formType === "name") {
      popularForm.style.display = "none";
      nameForm.style.display = "block";
    }

}


document.addEventListener('DOMContentLoaded', async function () {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutForm = document.getElementById('logoutForm')
      try {
        const response = await fetch('/site/auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
            logoutForm.style.display = 'inline';
        }
        else {
            loginLink.style.display = 'inline';
            registerLink.style.display = 'inline';
        }

      } catch (error) {
        
      }
});

function removeFromGroup(eventId, groupID, userToken) {
    const url = `/group/${groupID}/events/${eventId}`
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ id: eventId }),
    })
    .then(response => {
        if (response.ok) {
            window.location = `/site/groups/${groupID}/`
        }
    })
    .catch(error => {
        console.log(error);
    });
}

async function addSelectedEvents(groupID, userToken) {
    
    const checkboxes = document.querySelectorAll('input[name="selectedEvent"]:checked');

    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i]
        await fetch(`/group/${groupID}/events/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: checkbox.value}),
        })
    }
    window.location = `/site/groups/${groupID}/`;
}


function editGroup(groupID, userToken) {

    const isValid = validateGroupForm(`editGroup${groupID}`, groupID)

    if(isValid) {
        const url = `/group/${groupID}/`

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                name: document.getElementById(`group${groupID}-name`).value,
                description: document.getElementById(`group${groupID}-desc`).value
            }),
        })
        .then(response => {
            if (response.ok) {
                window.location = `/site/groups`
            }
        })
    }
   
}



function removeGroup(groupID, userToken) {

    const url = `/group/${groupID}/`

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${userToken}`
        },
    })
    .then(response => {
        if (response.ok) {
            window.location = `/site/groups`
        }
    })
}


function validateLoginRegisterForm() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    if (username === '' || password === '') {
        document.getElementById('errorMessage').innerText = 'Both username and password are required';
        return false;
    }

    return true;
}
