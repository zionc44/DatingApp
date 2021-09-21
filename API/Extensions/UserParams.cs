﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        private int pageSize = 10;
        public int PageNumber { get; set; }
        public int PageSize
        {
            get => pageSize;
            set => pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        public string CurrentUsername { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 150;
        public string OrderBy { get; set; } = "lastActive";
    }
}
