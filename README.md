# swig-react-tags
Swig extensions to write react components using swig tags

## Usage
### Basic example
#### React component swig file
```html
{# hello.html #}

{% react render %}
    <div>Hello, {this.props.name}!</div>
{% endreact %}
```
#### Template swig file
```html
{# index.html #}
<!DOCTYPE html>
{% reactuse "./hello.html" as Hello %}

{% react render %}
<Hello name="John" />
{% endreact %}
```

#### Output
```html
<!DOCTYPE html>

<div data-react-render-id="...">
    <div data-reactid="..." data-react-checksum="..."><span data-reactid="...">Hello, </span><span data-reactid="...">John</span><span data-reactid="...">!</span></div>
<script>
var Hello = React.createClass({
    render: function render() {
        return (
            React.DOM.div(null, "Hello, ", this.props.name, "!")
        );
    }
});
var _index = React.createClass({
render: function render() {
    return (
        Hello({name: "John"})
        );
    }
});
React.renderComponent(_index(null), document.querySelector('[data-react-render-id="..."]'));
</script>
</div>
```


## License
Copyright (C) 2014  Jesse Smick

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
