import errorToHttp from '../errors-to-http-responses.mjs'
import errors from '../../common/errors.mjs'
import { Group } from '../../seca-classes.mjs'
import url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default function(secaServices) {
    
        return { 
            getPopularEvents : processRequest(getPopularEventsProcessor),
            searchEvent : processRequest(searchEventProcessor),
            createGroup : processRequest(createGroupProcessor, true),
            updateGroup : processRequest(updateGroupProcessor, true),
            getAllGroups : processRequest(getAllGroupsProcessor, true),
            deleteGroup : processRequest(deleteGroupProcessor, true),
            getGroup : processRequest(getGroupProcessor, true),
            addToGroup : processRequest(addToGroupProcessor, true),
            removeFromGroup : processRequest(removeFromGroupProcessor, true),
            getMoreDetails : processRequest(getEventDetails),
            getSearch : processRequest(getSearchPage),
            getHome : processRequest(getHomePage),
            getScripts : processRequest(getScripts),
            getCss : processRequest(getCss),
            groupSearchEventsPopular : processRequest(getPopularEventsProcessor, true),
            groupSearchEvents : processRequest(searchEventProcessor, true),
            getLogin : processRequest(getLogin),
            getRegister : processRequest(getRegister),
            register : processRequest(register),
            validateLogin : processRequest(validateLogin),
            logOut: processRequest(logOut),
            checkAuthenticated: processRequest(checkAuthenticated)
        }

        function processRequest(reqProcessor, auth) {
            return async function(req, rsp) {
        
                const token = getToken(req)
        
                if(auth && !req.user) {
                    rsp.redirect('/site/login')
                    return
                }
        
                try {
                    if(auth) return await reqProcessor(req, rsp, token)
                    return await reqProcessor(req, rsp) 
                } catch (e) {
                    console.log(e)
                    const rspError = errorToHttp(e)
                    rsp.status(rspError.status).render('error', {error: rspError})
                }
            }
        }

        function getScripts(req, res) {
            sendFile('scripts.js', '.', res)
        }

        async function getCss(req, res) {
            sendFile('secaSite.css', 'css', res)
        }
        
        async function getSearchPage(req, res) {
            sendFile('search.html', 'public', res)
        }
        
        async function getHomePage(req, res) {
            sendFile('home.html', 'public', res)
        }

        async function getLogin(req, res) {
            sendFile('login.html', 'public', res)
        }

        async function getRegister(req, res) {
            sendFile('register.html', 'public', res)
        }
        
        function sendFile(fileName, folder, rsp) {
            const fileLocation = __dirname + `${folder}/` + fileName
            rsp.sendFile(fileLocation)
        }

        function checkAuthenticated(req, res) {
            if(req.user) return res.status(200).json()
            else return res.status(401).json()
        }
        
        async function getEventDetails(req, res) {
            const id = req.query.id
            if(!id) throw errors.ARGUMENT_MISSING('id')
            const event = await secaServices.getMoreDetails(id)
            return res.render('eventDetails', event)
        }
        
        async function getPopularEventsProcessor(req, res, token) {
        
            const s = (req.query.s) ? req.query.s : 30
            const p = (req.query.p) ? req.query.p : 1
        
            let group = (req.params.id && token) ? await secaServices.getGroupServ(req.params.id, token) : undefined
            let path = (req.params.id && token) ? `/site/groups/${req.params.id}/events/search/popular`  : `/site/search/popular`
        
            if(!isValidIndex(s)) throw errors.INVALID_ARGUMENT('s')
            if(!isValidIndex(p)) throw errors.INVALID_ARGUMENT('p')
        
            const events = await secaServices.getPopularEvents(s, p)
            return res.render('searchResult', {events: events, group: group, size: s, page: p, path: path})
        
        }
        
        
        async function searchEventProcessor(req, res, token) {
        
            if(!req.query.name) throw errors.ARGUMENT_MISSING('Name')
        
            const name = req.query.name
            const s = (req.query.s) ? req.query.s : 30
            const p = (req.query.p) ? req.query.p : 1
        
            if(!isValidIndex(s)) throw errors.INVALID_ARGUMENT('s')
            if(!isValidIndex(p)) throw errors.INVALID_ARGUMENT('p')
        
            let group = (req.params.id && token) ? await secaServices.getGroupServ(req.params.id, token) : undefined
            let path = (req.params.id && token) ? `/site/groups/${req.params.id}/events/search/name`  : `/site/search/name`
        
            const events = await secaServices.searchEvent(name, s, p)
        
            return res.render('searchResult', {events: events, group: group, size: s, page: p, path: path, name: name})
        
        }
        
        async function createGroupProcessor(req, res, token) {
        
            if(!req.body.name || !req.body.description) throw errors.INVALID_BODY(req.body)
        
            const newGroup = new Group(req.body.name, req.body.description)
            await secaServices.createGroup(newGroup, token)
        
            return res.redirect('/site/groups')
        
        }
        
        async function updateGroupProcessor(req, res, token) {
        
            if(!req.params.id) throw errors.ARGUMENT_MISSING('Id')
        
            if(!req.body.name || !req.body.description) throw errors.INVALID_BODY(req.body)
        
            const newGroup = new Group(req.body.name, req.body.description)
            await secaServices.updateGroup(req.params.id, newGroup, token)
        
            return res.redirect('/site/groups')
        }
        
        async function getAllGroupsProcessor(req, res, token) {
            const groups = await secaServices.getAllGroups(token)
            res.render('groups', {groups: groups, user: req.user})
        }
        
        async function deleteGroupProcessor(req, res, token) {
        
            if (!req.params.id) {
                throw errors.ARGUMENT_MISSING('Id');
            }
        
            await secaServices.deleteGroup(req.params.id, token);
        
            return res.redirect('/site/groups')
        
        }
        
        async function getGroupProcessor(req, res, token) {
        
            if (!req.params.id) {
                throw errors.ARGUMENT_MISSING('Id');
            }
        
            const group = await secaServices.getGroupServ(req.params.id, token)
          
            return res.render('group', {group: group})
        
        }
        
        async function addToGroupProcessor(req, res, token) {

            if (!req.params.id) {
                throw errors.ARGUMENT_MISSING('Id');
            }
        
            if(!req.body.id) {
                throw errors.INVALID_BODY()
            }
        
            const group = await secaServices.addToGroup(req.params.id, req.body.id, token)
        
            return res.redirect(`/site/groups/${group.id}`)
        
        }
        
        async function removeFromGroupProcessor(req, res, token) {
            if (!req.params.id) throw errors.ARGUMENT_MISSING('Group id');
            if (!req.body.id) throw errors.ARGUMENT_MISSING('Event id');
            await secaServices.removeEventFromGroup(req.params.id, req.body.id, token)
            return res.redirect(`/site/groups/${req.params.id}/`)
        }
        
        async function register(req, res) {

            const username = req.body.username
        
            if(!username) throw errors.ARGUMENT_MISSING('Username')

            const password = req.body.password

            if(!password) throw errors.ARGUMENT_MISSING('Password')
        
            const user = await secaServices.createUser(username, password)

            if(user) req.login(user, () =>  res.redirect('/site/home'))
            else return res.redirect('/site/home')
        
        }


        function logOut(req, rsp) {
            req.logout((err) => { 
              rsp.redirect('/site/home')
            })
          }


        async function validateLogin(req, res) {
            const user = await secaServices.validateUser(req.body.username, req.body.password)
            if(user) req.login(user, () => res.redirect('/site/home'))
            else res.redirect('/site/login')
        }
        
        
        function isValidIndex(idx) {
            return /[0-9]/.test(idx)
        }
        
        function getToken(req) {
            return (req.user) ? req.user.token : ''
        }
}

