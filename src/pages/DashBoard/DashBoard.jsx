import ProfileDashboard from '../../components/DashBoard/ProfileDashboard';
import { useSelector } from 'react-redux';

function DashBoard() {

    const {user} = useSelector((state) => state.auth)
  return (
    <div>
        <ProfileDashboard user={user}/>
    </div>
  )
}

export default DashBoard