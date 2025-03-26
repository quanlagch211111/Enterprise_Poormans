import { Button, FormControl, InputGroup } from "react-bootstrap";

export const SearchComponant = ({ onSearch }) => {
  return (
    <InputGroup className="flex-nowrap" size="lg">
      <InputGroup.Text id="addon-wrapping">
        <i class="fa-solid fa-magnifying-glass"></i>
      </InputGroup.Text>
      <FormControl
        type="search"
        placeholder="Search"
        aria-label="search"
        aria-describedby="addon-wrapping"
        onChange={(e) => onSearch(e.target.value)}
      ></FormControl>
    </InputGroup>
  );
};
