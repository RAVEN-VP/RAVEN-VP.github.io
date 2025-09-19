document.addEventListener('DOMContentLoaded', () => {
    fetch('team.json')
        .then(response => response.json())
        .then(data => {
            const teamMembersContainer = document.getElementById('team-members');
            data.forEach(member => {
                const memberDiv = document.createElement('div');
                memberDiv.className = 'team-member';
                memberDiv.innerHTML = `
                    <h3>${member.name}</h3>
                    <p><strong>${member.role}</strong></p>
                    <p>${member.bio}</p>
                `;
                teamMembersContainer.appendChild(memberDiv);
            });
        });
});