import ProfileDashboard from '../../components/DashBoard/ProfileDashboard';
import { useSelector } from 'react-redux';

function DashBoard() {

    const {user} = useSelector((state) => state.auth)
  return (
    <div className="h-full overflow-hidden">
        <ProfileDashboard user={user}/>
    </div>
  )
}

export default DashBoard