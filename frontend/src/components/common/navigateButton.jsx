import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function NavigateButton({
        content,
        url,
        replace = false,
        state,
        ...buttonProps
    }) {
    const navigate = useNavigate()
    const handleClick = () => {
        if(!url) return ;
        navigate(url, {replace, state})
    }

  return (
    <Button variant="contained" onClick={handleClick} {...buttonProps}>
      {content}
    </Button>
  );
}