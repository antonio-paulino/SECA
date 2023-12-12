async function addSelectedEvents(groupID) {
    const checkboxes = document.querySelectorAll('input[name="selectedEvent"]:checked');

    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i]
        await fetch(`/site/groups/${groupID}/events/add`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: checkbox.value}),
        })
    }
    window.location.href = `/site/groups/${groupID}/`;
}


function getUrl(type, size, page, path, name) {
    let pageNum = parseInt(page)
    let url = (type == 'previous') ? `${path}?s=${size}&p=${pageNum - 1}` : `${path}?s=${size}&p=${pageNum + 1}`;
    if(name) url = `${url}&name=${name}`
    window.location.href = url
}


function validateGroupForm(formID, groupID) {
    
    const form = (formID == `editGroup`) ? document.getElementById(`editGroup${groupID}`) : document.getElementById(formID);

    const groupName = form.querySelector('input[name="name"]').value;
    const groupDescription = form.querySelector('input[name="description"]').value;

    const errorMessage = (formID == `editGroup`) ? document.getElementById(`errorMessage${groupID}`) : document.getElementById(`errorMessage`);

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
    const editForm = document.getElementById(`editGroup${groupId}`);
    const editButton = groupDetails.querySelector('button');
    

    editButton.style.display = 'none';

    groupName.style.display = groupName.style.display === 'none' ? 'block' : 'none';
    groupDescription.style.display = groupDescription.style.display === 'none' ? 'block' : 'none';
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
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
