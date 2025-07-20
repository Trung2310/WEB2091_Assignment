import React, { useState } from 'react';
import { Input, Button, Table } from 'antd';
import { clientService } from '../../../services/clientService';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const results = await clientService.searchProducts(query);
    setSearchResults(results);
  };

  return (
    <div>
      <Input
        placeholder="Tìm kiếm sản phẩm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: 200 }}
      />
      <Button onClick={handleSearch} type="primary">Tìm kiếm</Button>

      <Table
        dataSource={searchResults}
        columns={[
          { title: 'Tên sản phẩm', dataIndex: 'name' },
          { title: 'Giá', dataIndex: 'price' },
          { title: 'Màu sắc', dataIndex: 'color' },
        ]}
      />
    </div>
  );
};

export default Search;
