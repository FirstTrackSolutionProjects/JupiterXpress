import Welcome from '../Components/Welcome'
import StarsCanvas from '../Components/Canvas/Stars'

const WelcomeSpaceTheme = ({loggedIn, setLoggedIn}) => {
    return (
        <>
            <div className='fixed inset-0 bg-black z-[-1] text-white'>
                <StarsCanvas />
            </div>
            <div className='min-h-screen w-full'>
                <Welcome loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </div>
        </>
    )
}

export default WelcomeSpaceTheme
