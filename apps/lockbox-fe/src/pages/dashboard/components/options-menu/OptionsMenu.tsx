import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Snackbar, Tooltip } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DirectShareModal from '../modals/DirectShareModal';
import ShareIcon from '@mui/icons-material/Share';
import LaunchIcon from '@mui/icons-material/Launch';
import { authorizedFetch } from '../../../../../src/helpers/request-interceptor';
import ENVIRONMENT from '../../../../../src/helpers/environment';
import { getVaultRequest } from '../../redux/actions';
import { useAppDispatch } from '../../../../../src/store';

interface MenuParameters {
  password: string;
  username: string;
  link?: string;
  alias: string;
  id: string;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

//props for the menu

export default function CustomizedMenus({
  password,
  username,
  link,
  alias,
  id,
}: MenuParameters) {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [openDirectShareModal, setOpenDirectShareModal] = React.useState(false);
  // const [shareLink, setShareLink] = React.useState('');
  // const [openLinkShareModal, setOpenLinkShareModal] = React.useState(false);

  const open = Boolean(anchorEl);

  // handlers of the menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handler of snackbar
  const handleSnackbarClose = (
    e?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // handler of copy
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setSnackbarOpen(true);
    handleClose();
  };

  const handleDirectShareModalOpen = () => {
    setOpenDirectShareModal(true);
  };

  const handleLinkLaunch = (link: string) => () => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const handleDelete = (id: string) => {
    const payload = {
      id,
    }
    authorizedFetch(`${ENVIRONMENT.BACKEND_API}/vault/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status === 200) {
        handleClose();
    dispatch(getVaultRequest('', ''));
        
      }
    });
  };


  return (
    <div>
      <DirectShareModal
        open={openDirectShareModal}
        setOpenModal={setOpenDirectShareModal}
        ModalData={{ password, username, link, alias } as MenuParameters}
      />

      <Button
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity='success'
          sx={{ width: '100%' }}
        >
          Password Copied to Clipboard
        </Alert>
      </Snackbar>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {link && (
          <MenuItem onClick={handleLinkLaunch(link)}>
          <LaunchIcon />
          Launch
        </MenuItem>
        )}

        <MenuItem onClick={handleCopyToClipboard}>
          <FileCopyIcon />
          Copy Password
        </MenuItem>

        <Tooltip title='Share password with other users' arrow>
          <MenuItem onClick={handleDirectShareModalOpen}>
            <ShareIcon />
            Direct Share
          </MenuItem>
        </Tooltip>

        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleDelete(id)}>
          <DeleteIcon />
          Delete
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
