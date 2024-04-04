import React from 'react'
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Avatar, Box, Stack, styled, useTheme } from '@mui/material';
import MuiDrawer from "@mui/material/Drawer";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { BarChart, PieChart, Timeline } from '@mui/icons-material';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { grey } from '@mui/material/colors';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';




const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });
  
  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });


const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(
    // @ts-ignore
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      }),
    })
  );


  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
 const Array1=[
  {"text":"Dashboard",'icon':<HomeIcon/> ,"path":"/"} ,
  {"text":"User List",'icon':<PersonIcon/> ,"path":"/user"} ,
  {"text":"Badge List",'icon':<BadgeIcon/> ,"path":"/carte"} ,
  {"text":"User",'icon':<PersonAddIcon/> ,"path":"/formuser"} ,
  {"text":"User badge",'icon': <ContactsOutlinedIcon/>,"path":"/userbadge"} ,
  {"text":"Timezones",'icon':<AccessTimeIcon/> ,"path":"/timezone"} ,
] 
const Array2=[
  {"text":"Evenments",'icon':<EventIcon/> ,"path":"/evenement"} ,
  {"text":"Bar chart",'icon':<BarChart/> ,"path":"/bar"} ,
  {"text":"Pie Chart",'icon':<PieChart/> ,"path":"/pie"} ,
  {"text":"Line Chart",'icon':<Timeline/> ,"path":"/timeline"} ,
] 
const Array3=[
  {"text":"Porte Parametrs",'icon':<SensorDoorIcon/> ,"path":"/door"} ,
] 
function SideBar(open,handleDrawerClose) {
    let location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
  return (
   
         <Drawer variant="permanent" open={open}>

        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

       
        <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img
       
        width={open ?88:44} height={open ?40:30}
        src='../seca.png'
      />
    </div>
      

        
        <Divider />

        <List>
          {Array1.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
              <ListItemButton
              onClick={() => { navigate(item.path) }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor: location.pathname === item.path?theme.palette.mode  ==='dark'? grey[800]:grey[300]: null
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          {Array2.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
              <ListItemButton
              onClick={() => { navigate(item.path) }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor: location.pathname === item.path?theme.palette.mode  ==='dark'? grey[800]:grey[300]: null
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
<Box flexGrow={1}></Box>

        <List>
          {Array3.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
              <ListItemButton
              onClick={() => { navigate(item.path) }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor: location.pathname === item.path?theme.palette.mode  ==='dark'? grey[800]:grey[300]: null
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>


      </Drawer>
    
  )
}

export default SideBar