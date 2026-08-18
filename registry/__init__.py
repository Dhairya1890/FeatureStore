"""
Feature Registry

- It is the source of truth for every feature in the system
- It defines a feature once
- It stores its metadata    
- It makes the feature discoverable
- It lets both training and serving code read the same defination  
"""

# Feature Registration API

''' This is a user facing entry point'''

from dataclasses import dataclass
from typing import Callable

''' What is a dataclass - A Dataclass is a python module that makes it easy to write classes, it automatically handles the init and other class boilerplatting so we don't have to write them'''

''' A dataclass is just a class that holds data, It's python's clean way of defining a container for related fields'''

@dataclass
class FeatureRecord:
    name : str
    entity_type : str
    fn : Callable
    ttl : int = 3600
    description : str = ""
    data_type : str = "float"

    @property
    def compute_fn(self):
        return self.fn

''' In Memory Store '''

_registry : dict[str, FeatureRecord] = {}

''' The decorator '''

def feature(entity : str, ttl : int = 3600, description : str = "", data_type : str = "float"):

    def wrapper(fn):
        new_feature = FeatureRecord(fn.__name__, entity_type=entity, fn=fn, ttl=ttl, description=description, data_type=data_type)
        new_feature.compute_fn = fn
        _registry[fn.__name__] = new_feature
        return fn
    return wrapper

def get(name : str) -> FeatureRecord:
    return _registry.get(name)

def list_all() -> dict[str, FeatureRecord]:
    return _registry

