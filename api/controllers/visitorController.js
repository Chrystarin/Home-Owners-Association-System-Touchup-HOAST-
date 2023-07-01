const {
    roles: { USER },
    types: { EMPLOYEE, RESIDENT }
} = require('../helpers/constants');
const { checkString, checkDate } = require('../helpers/validData');
const { genVisitorId, genNotificationId } = require('../helpers/generateId');
const { VisitorNotFoundError } = require('../helpers/errors');
const extractHomes = require('../helpers/extractHomes');
const Notification = require('../models/Notification');
const HOA = require('../models/HOA');
const { notifType, messages } = require('../helpers/notificationUtils');

const addVisitor = async (req, res, next) => {
    const { name, purpose, arrival, departure, note } = req.body;
    const { type } = req.user;

    // Validate input
    checkString(name, 'Visitor Name');
    checkString(purpose, 'Purpose');
    checkString(note, 'Note');
    checkDate(arrival, 'Arrival');
    checkDate(departure, 'Departure');

    // Create visitor
    const visitor = {
        visitorId: genVisitorId(),
        name,
        purpose,
        arrival,
        departure,
        note
    };

    if(EMPLOYEE.has(type)) {
        const { hoa } = req.user;

        hoa.visitors.push(visitor);
        await hoa.save();
    }

    if(RESIDENT.has(type)) {
        const { home } = req.user;

        home.visitors.push(visitor);
        await home.save();
        await home.populate('owner');

        const hoa = await HOA.findById(home.hoa);

        const notifParams = {
            message: messages[notifType.NewVisitor](home.owner.name, visitor.visitorId, home.name, visitor.arrival),
            type: notifType.NewVisitor,
            subjectId: visitor.visitorId
        };

        const createNotifs = [];
        createNotifs.push(Notification.create({ ...notifParams, notificationId: genNotificationId(), user: hoa.admin }));
        hoa.guards
            .filter(({ status }) => status === 'active')
            .forEach((guard) => createNotifs.push(Notification.create({ ...notifParams, notificationId: genNotificationId(), user: guard.user })));

        await Promise.all(createNotifs);
    }

    res.status(201).json({
        message: 'Visitor added',
        visitorId: visitor.visitorId
    });
};

const getVisitors = async (req, res, next) => {
    const { visitorId } = req.query;
    const { type } = req.user;

    // Validate input
    checkString(visitorId, 'Visitor ID', true);

    let visitors;

    if (type === USER) {
        const { user } = req.user;

        // Get visitors from homes
        ({ visitors } = await extractHomes({ 'residents.user': user._id }));
    }

    if (RESIDENT.has(type)) {
        const { home } = req.user;

        // Get visitors under home
        visitors = home.visitors;
    }

    if (EMPLOYEE.has(type)) {
        const { hoa } = req.user;

        // Get vistiors of each home under hoa
        ({ visitors } = await extractHomes({ hoa: hoa._id }));
    }

    //Get specific visitor
    if (visitorId) {
        visitors = visitors.find(({ visitorId: vi }) => visitorId == vi);

        if (!visitors) throw new VisitorNotFoundError();
    }

    res.json(visitors);
};

module.exports = { addVisitor, getVisitors };
