export function ChangeStatus(users) {
    users.forEach(id => {
        const user=document.querySelector(`[data-userid="${id}"] div`)
        if(user){
            user.style.backgroundColor="green"
            user.style.setProperty('background-color', 'green', 'important');

        }
        
        
    });
}
