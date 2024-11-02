'use client'

// React Imports
import { useState, useEffect } from 'react'

import {  } from 'react';
import { useSearchParams , useRouter } from 'next/navigation'

import Cookies from 'js-cookie';


// Next Imports

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import { useDispatch, useSelector } from 'react-redux'

import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Auth Imports
import { useLoginMutation, useLogoutUserMutation } from '../redux/features/authApiSlice'
import { setAuth } from '../redux/features/authSlice'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const LoginV2 = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const searchParams = useSearchParams()
  const [logoutUser, { isLoadings, isErrors, errors }] = useLogoutUserMutation();

  // for session out
  useEffect(() => {
    const handleLogout = async () => {
      await logoutUser();
    };

    if(searchParams.get('sessionExpired')){
      handleLogout();
    }
  }, [router.query, logoutUser]);

  // Login form
  useEffect(() => {
    const token = Cookies.get('access_token');

    if (token) {
      router.push('/home');
    }


    // back disabled
    const disableBackButton = () => {
      window.history.pushState(null, '', window.location.href);
    };

    disableBackButton();
    window.addEventListener('popstate', disableBackButton);


      return () => {
            window.removeEventListener('popstate', disableBackButton);
          };
  }, [router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(false);
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [loginError, setLoginError] = useState(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const setTokenCookie = (token, remember) => {
    Cookies.set('access_token', token, {
      expires: remember ? 7 : undefined,
      secure: true,
      sameSite: 'Strict',
    });
  };

  const setUserDataInCookie = (user, remember) => {
      Cookies.set('authUser', JSON.stringify(user), {
          expires: remember ? 7 : undefined,
          secure: true,
          sameSite: 'Strict',
      });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoginError(null);

      try {
          const result = await login({ email, password }).unwrap();

          if (result?.success) {
              const user = result.results.user;

              dispatch(setAuth({
                  isAuthenticated: true,
                  user: user,
              }));
              setTokenCookie(result.results.access_token, isRemember);
              setUserDataInCookie(user, isRemember);
              router.push('/home');
          }else{
            setLoginError(result.message);
          }
      } catch (err) {
          console.error('Login failed:', err);
      }
  };

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
            {loginError && (
              <Typography
                sx={{
                  color: 'white',
                  backgroundColor: 'error.main',
                  textAlign: 'center',
                  borderRadius: '8px',
                  padding: '8px',
                  marginTop: '16px',
                }}
              >
                {loginError}
              </Typography>
            )}
          </div>
          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit}
            className='flex flex-col gap-5'
          >
            <CustomTextField autoFocus fullWidth label='Email or Username' placeholder='Enter your email or username'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
            <FormControlLabel
              control={<Checkbox checked={isRemember} onChange={() => setIsRemember(!isRemember)} />}
              label="Remember me"
            />
              <Typography className='text-end' color='primary' component={Link}>
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={isLoading || isAuthenticated}>
              {isLoading ? 'Logging in...' : isAuthenticated ? 'Success' : 'Login'}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} color='primary'>
                Create an account
              </Typography>
            </div>
            <Divider className='gap-2 text-textPrimary'>or</Divider>
            <div className='flex justify-center items-center gap-1.5'>
              <IconButton className='text-facebook' size='small'>
                <i className='tabler-brand-facebook-filled' />
              </IconButton>
              <IconButton className='text-twitter' size='small'>
                <i className='tabler-brand-twitter-filled' />
              </IconButton>
              <IconButton className='text-textPrimary' size='small'>
                <i className='tabler-brand-github-filled' />
              </IconButton>
              <IconButton className='text-error' size='small'>
                <i className='tabler-brand-google-filled' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
