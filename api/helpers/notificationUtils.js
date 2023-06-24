const notifType = {
    DueNotPaid: 'DUE',
    NewVisitor: 'VISITOR',
    HomeRequestSent: 'HOMESENT',
    HomeRequestApproved: 'HOMEAPPROVED'
};

const messages = {
    DUE: ({ firstName, lastName }, name) => `Due of ${firstName} ${lastName}'s ${name} is not paid`,
    VISITOR: ({ firstName, lastName }, visitor, name, arrival) => `${firstName} ${lastName} has added a Visitor#${visitor} for ${name} arriving on ${arrival}`,
    HOMESENT: ({ firstName, lastName }) => `${firstName} ${lastName} has sent a home request`,
    HOMEAPPROVED: (name) => `Your request for ${name} has been approved`
};

module.exports = { notifType, messages };
